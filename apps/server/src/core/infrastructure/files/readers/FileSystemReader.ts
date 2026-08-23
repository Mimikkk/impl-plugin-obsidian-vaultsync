import { readdir, stat } from "node:fs/promises";
import type { Stats } from "node:fs";
import { extname, resolve } from "node:path";
import { FileReader } from "@server/core/infrastructure/files/readers/FileReader.ts";
import { StaticFileNs } from "@server/features/static/domain/StaticFile.ts";

export interface FileInfo {
  isFile: boolean;
  isDirectory: boolean;
  size: number;
  mtime: Date | null;
  birthtime: Date | null;
}

function toFileInfo(stats: Stats): FileInfo {
  return {
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    size: stats.size,
    mtime: stats.mtime,
    birthtime: stats.birthtime,
  };
}

export class FileSystemReader {
  static create(path: string = "."): FileSystemReader {
    return new FileSystemReader(path);
  }

  private constructor(
    private readonly location: string,
    private readonly reader = FileReader.create(),
  ) {}

  path(path: string): string {
    return resolve(this.location, path);
  }

  async read<P extends StaticFileNs.Path>(path: P): Promise<StaticFileNs.FromPath<P> | undefined> {
    path = this.path(path) as P;

    const extension = extname(path).slice(1) as StaticFileNs.Extension;
    if (!extension) return undefined;

    const type = StaticFileNs.TypeMap[extension] ?? StaticFileNs.typeFallback;
    const content = await this.reader.read(path, type);
    if (content === undefined) return undefined;

    const mime = StaticFileNs.MimeMap[extension] ?? StaticFileNs.mimeFallback;
    return { content, mime } as StaticFileNs.FromPath<P>;
  }

  async readStr(path: string): Promise<string | undefined> {
    return await this.reader.readStr(this.path(path));
  }

  async readU8(path: string): Promise<Uint8Array | undefined> {
    return await this.reader.readU8(this.path(path));
  }

  mime(path: string): string {
    return this.reader.mime(this.path(path));
  }

  async list(options: { path?: string; recursive?: boolean }): Promise<string[]> {
    async function traverse(paths: string[], path: string, recursive: boolean): Promise<string[]> {
      const entries = await readdir(path, { withFileTypes: true });
      for (const entry of entries) {
        const next = resolve(path, entry.name);
        paths.push(next);

        if (recursive && entry.isDirectory()) {
          await traverse(paths, next, recursive);
        }
      }

      return paths;
    }
    const start = this.path(options.path ?? ".");

    const exists = await this.exists(start);
    if (!exists) return [];

    const stats = await stat(start);
    if (!stats.isDirectory()) return [];

    const paths = await traverse([], start, options.recursive ?? false);

    return paths.map((path) => path.replace(start + "\\", ""));
  }

  async exists(path: string): Promise<boolean> {
    try {
      const stats = await stat(this.path(path));

      return stats.isFile() || stats.isDirectory();
    } catch {
      return false;
    }
  }

  async stats(path: string): Promise<FileInfo | null> {
    try {
      return toFileInfo(await stat(this.path(path)));
    } catch {
      return null;
    }
  }
}
