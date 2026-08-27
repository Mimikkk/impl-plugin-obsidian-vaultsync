import type { TFile, Vault } from "obsidian";
import { api } from "./api.ts";
import { resolveConflict } from "./conflict.ts";
import { sha256 } from "./hash.ts";
import { plan } from "./plan.ts";

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

async function removeLocal(vault: Vault, path: string) {
  const file = vault.getFileByPath(path);
  if (file) await vault.delete(file);

  const parts = path.split("/").slice(0, -1);
  while (parts.length) {
    const dir = parts.join("/");
    const folder = vault.getFolderByPath(dir);
    if (!folder || folder.children.length > 0) break;
    await vault.delete(folder, true);
    parts.pop();
  }
}

export async function synchronize(vault: Vault, bases: Record<string, string>) {
  const locals = vault.getFiles().filter((file) => tracked(file.path));
  const remotes = new Map((await api.list.fetch({})).map((file) => [file.path, file.hash]));
  const localHashes = new Map<string, string>();
  const localBytes = new Map<string, ArrayBuffer>();

  for (const file of locals) {
    const bytes = await readLocal(vault, file);
    localBytes.set(file.path, bytes);
    localHashes.set(file.path, await sha256(bytes));
  }

  const conflicts: { localPath: string; remotePath: string }[] = [];

  for (const op of plan(localHashes, remotes, bases)) {
    if (op.type === "remember") {
      bases[op.path] = op.hash;
      continue;
    }
    if (op.type === "forget") {
      delete bases[op.path];
      continue;
    }
    if (op.type === "upload") {
      const bytes = localBytes.get(op.path);
      if (!bytes) continue;
      await api.put.fetch({ params: { path: op.path }, payload: bytes });
      bases[op.path] = localHashes.get(op.path) ?? (await sha256(bytes));
      continue;
    }
    if (op.type === "download") {
      const remote = await api.get.fetch({ params: { path: op.path } });
      if (!remote) continue;
      await writeLocal(vault, op.path, remote);
      bases[op.path] = remotes.get(op.path) ?? (await sha256(remote));
      continue;
    }
    if (op.type === "removeLocal") {
      await removeLocal(vault, op.path);
      continue;
    }
    if (op.type === "removeRemote") {
      await api.delete.fetch({ params: { path: op.path } });
      continue;
    }
    conflicts.push(op);
  }

  for (const { localPath, remotePath } of conflicts) {
    const local =
      localBytes.get(localPath) ?? (await api.get.fetch({ params: { path: localPath } }));
    const remote = await api.get.fetch({ params: { path: remotePath } });
    if (!local || !remote) continue;

    const result = await resolveConflict(localPath, remotePath, local, remote);
    if (result.action === "skip") continue;

    if (result.action === "local") {
      await writeLocal(vault, localPath, local);
      await api.put.fetch({ params: { path: localPath }, payload: local });
      if (remotePath !== localPath) {
        await api.delete.fetch({ params: { path: remotePath } });
        await removeLocal(vault, remotePath);
        delete bases[remotePath];
      }
      bases[localPath] = await sha256(local);
      continue;
    }

    if (result.action === "remote") {
      await writeLocal(vault, remotePath, remote);
      if (localPath !== remotePath) {
        await removeLocal(vault, localPath);
        delete bases[localPath];
      }
      bases[remotePath] = await sha256(remote);
      continue;
    }

    await writeLocal(vault, localPath, result.bytes);
    await api.put.fetch({ params: { path: localPath }, payload: result.bytes });
    if (remotePath !== localPath) {
      await api.delete.fetch({ params: { path: remotePath } });
      await removeLocal(vault, remotePath);
      delete bases[remotePath];
    }
    bases[localPath] = await sha256(result.bytes);
  }

  return bases;
}
