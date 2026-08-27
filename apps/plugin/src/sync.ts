import type { TFile, Vault } from "obsidian";
import { api } from "./api.ts";
import { resolveConflict } from "./conflict.ts";
import { sha256 } from "./hash.ts";

function tracked(path: string) {
  return !path.split("/").some((part) => part.startsWith("."));
}

async function ensureFolder(vault: Vault, filePath: string) {
  const parts = filePath.split("/").slice(0, -1);
  let acc = "";
  for (const part of parts) {
    acc = acc ? `${acc}/${part}` : part;
    if (!vault.getFolderByPath(acc)) await vault.createFolder(acc);
  }
}

async function readLocal(vault: Vault, file: TFile) {
  return vault.readBinary(file);
}

async function writeLocal(vault: Vault, path: string, bytes: ArrayBuffer) {
  await ensureFolder(vault, path);
  const existing = vault.getFileByPath(path);
  if (existing) {
    await vault.modifyBinary(existing, bytes);
    return;
  }
  await vault.createBinary(path, bytes);
}

export async function synchronize(vault: Vault, bases: Record<string, string>) {
  const locals = vault.getFiles().filter((file) => tracked(file.path));
  const remotes = new Map((await api.list()).map((file) => [file.path, file.hash]));
  const localHashes = new Map<string, string>();
  const localBytes = new Map<string, ArrayBuffer>();

  for (const file of locals) {
    const bytes = await readLocal(vault, file);
    localBytes.set(file.path, bytes);
    localHashes.set(file.path, await sha256(bytes));
  }

  const paths = new Set([...localHashes.keys(), ...remotes.keys()]);
  const conflicts: string[] = [];

  for (const path of paths) {
    const localHash = localHashes.get(path);
    const remoteHash = remotes.get(path);
    const base = bases[path];

    if (localHash && remoteHash) {
      if (localHash === remoteHash) {
        bases[path] = localHash;
        continue;
      }
      if (base === remoteHash) {
        await api.put(path, localBytes.get(path)!);
        bases[path] = localHash;
        continue;
      }
      if (base === localHash) {
        const remote = await api.get(path);
        if (!remote) continue;
        await writeLocal(vault, path, remote);
        bases[path] = remoteHash;
        continue;
      }
      conflicts.push(path);
      continue;
    }

    if (localHash && !remoteHash) {
      if (base && base === localHash) {
        const file = vault.getFileByPath(path);
        if (file) await vault.delete(file);
        delete bases[path];
        continue;
      }
      await api.put(path, localBytes.get(path)!);
      bases[path] = localHash;
      continue;
    }

    if (remoteHash && !localHash) {
      if (base && base === remoteHash) {
        await api.delete(path);
        delete bases[path];
        continue;
      }
      const remote = await api.get(path);
      if (!remote) continue;
      await writeLocal(vault, path, remote);
      bases[path] = remoteHash;
    }
  }

  for (const path of conflicts) {
    const local = localBytes.get(path);
    const remote = await api.get(path);
    if (!local || !remote) continue;

    const result = await resolveConflict(path, local, remote);
    if (result.action === "skip") continue;
    if (result.action === "remote") {
      await writeLocal(vault, path, remote);
      bases[path] = await sha256(remote);
      continue;
    }
    await writeLocal(vault, path, result.bytes);
    await api.put(path, result.bytes);
    bases[path] = await sha256(result.bytes);
  }

  return bases;
}
