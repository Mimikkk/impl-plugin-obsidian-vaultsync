import { singleton } from "@nimir/framework";
import { FileSystemAssetReader } from "@server/core/infrastructure/files/readers/FileSystemAssetReader.ts";
import type { DocumentationAssetUrl } from "./DocumentationAssetUrl.ts";

@singleton
export class DocumentationAssetProvider {
  static create(
    reader = FileSystemAssetReader.fromMeta(import.meta),
  ): DocumentationAssetProvider {
    return new DocumentationAssetProvider(reader);
  }

  private constructor(
    private readonly reader: FileSystemAssetReader,
  ) {}

  read<Url extends DocumentationAssetUrl>(url: Url) {
    return this.reader.read(url);
  }
}
