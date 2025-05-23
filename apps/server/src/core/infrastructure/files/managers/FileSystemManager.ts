import { type FileInfo, FileSystemReader } from "@server/core/infrastructure/files/readers/FileSystemReader.ts";
import { FileSystemWriter } from "@server/core/infrastructure/files/writers/FileSystemWriter.ts";
import type { StaticFileNs } from "@server/features/static/domain/StaticFile.ts";

export class FileSystemManager {
  static create(path: string) {
    return new FileSystemManager(path);
  }

  private constructor(
    path: string,
    private readonly writer = FileSystemWriter.create(path),
    private readonly reader = FileSystemReader.create(path),
  ) {}

  list(options: { path?: string; recursive?: boolean }): Promise<string[]> {
    return this.reader.list(options);
  }

  readStr(path: string): Promise<string | undefined> {
    return this.reader.readStr(path);
  }

  readU8(path: string): Promise<Uint8Array | undefined> {
    return this.reader.readU8(path);
  }

  read<P extends StaticFileNs.Path>(path: P): Promise<StaticFileNs.FromPath<P> | undefined> {
    return this.reader.read(path);
  }

  write(path: string, content: string): Promise<boolean> {
    return this.writer.write(path, content);
  }

  writeU8(path: string, content: Uint8Array): Promise<boolean> {
    return this.writer.writeU8(path, content);
  }

  remove(path: string, recursive = false): Promise<boolean> {
    return this.writer.remove(path, recursive);
  }

  mime(path: string): string {
    return this.reader.mime(path);
  }

  exists(path: string): Promise<boolean> {
    return this.reader.exists(path);
  }

  stats(path: string): Promise<FileInfo | null> {
    return this.reader.stats(path);
  }
}
