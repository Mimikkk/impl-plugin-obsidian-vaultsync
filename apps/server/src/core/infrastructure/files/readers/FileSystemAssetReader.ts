import { FileSystemReader } from "@server/core/infrastructure/files/readers/FileSystemReader.ts";
import type { StaticFileNs } from "@server/features/static/domain/StaticFile.ts";

export class FileSystemAssetReader {
  static create(path: string): FileSystemAssetReader {
    return new FileSystemAssetReader(path);
  }

  private constructor(
    readonly location: string,
    private readonly reader = FileSystemReader.create(location + "/assets"),
  ) {}

  read<P extends StaticFileNs.Path>(path: P): Promise<StaticFileNs.FromPath<P> | undefined> {
    return this.reader.read(path);
  }

  static fromMeta(meta: ImportMeta): FileSystemAssetReader {
    const path = meta.dirname!;
    return new FileSystemAssetReader(path);
  }
}
