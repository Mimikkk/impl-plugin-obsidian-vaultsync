import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

export async function removeDir(path: string): Promise<void> {
  await rm(path, { recursive: true, force: true });
}

async function walkFiles(dir: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walkFiles(path, files);
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

export async function copyTree(from: string, to: string): Promise<void> {
  await ensureDir(to);
  for (const source of await walkFiles(from)) {
    const target = join(to, relative(from, source));
    await ensureDir(dirname(target));
    await copyFile(source, target);
  }
}
