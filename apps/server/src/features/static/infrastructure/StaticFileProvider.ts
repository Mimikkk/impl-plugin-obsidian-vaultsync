import { resolve, singleton } from "@nimir/framework";
import { FileSystemReader } from "@server/core/infrastructure/files/readers/FileSystemReader.ts";
import { StaticAssetProvider } from "@server/features/static/infrastructure/StaticAssetProvider.ts";
import { StaticAssetNs } from "../domain/StaticAssetUrl.ts";
import type { StaticFileNs } from "../domain/StaticFile.ts";

@singleton
export class StaticFileProvider {
  static create(
    reader = FileSystemReader.create(),
    assets = resolve(StaticAssetProvider),
  ): StaticFileProvider {
    return new StaticFileProvider(reader, assets);
  }

  private constructor(
    private readonly reader: FileSystemReader,
    private readonly assets: StaticAssetProvider,
  ) {}

  read<P extends StaticFileNs.Path>(path: P): Promise<StaticFileNs.FromPath<P> | undefined> {
    if (StaticAssetNs.isUrl(path)) {
      return this.assets.read(path);
    }
    return this.reader.read(path);
  }
}
