import type { FileInfo } from "@server/infrastructure/files/readers/FileSystemReader.ts";

export interface FileInfoResource {
  createdAt: string;
  updatedAt: string;
  size: number;
}

export namespace FileInfoResource {
  export const fromFileInfo = (stats: FileInfo): FileInfoResource => ({
    createdAt: stats.birthtime?.toISOString()!,
    updatedAt: stats.mtime?.toISOString()!,
    size: stats.size,
  });
}
