import { singleton } from "@nimir/framework";
import { FileSystemAssetReader } from "@server/core/infrastructure/files/readers/FileSystemAssetReader.ts";
import type { StaticAssetUrl } from "../domain/StaticAssetUrl.ts";

@singleton
export class StaticAssetProvider {
  static create(
    reader = FileSystemAssetReader.fromMeta(import.meta),
  ): StaticAssetProvider {
    return new StaticAssetProvider(reader);
  }

  private constructor(
    private readonly reader: FileSystemAssetReader,
  ) {}

  async read<U extends StaticAssetUrl>(url: U) {
    return await this.reader.read(url);
  }
}
