import { resolve, singleton } from "@nimir/framework";
import { DocumentationAssetProvider } from "../../infrastructure/DocumentationAssetProvider.ts";
import type { DocumentationAssetUrl } from "../../infrastructure/DocumentationAssetUrl.ts";

@singleton
export class DocumentationService {
  static create(
    provider = resolve(DocumentationAssetProvider),
  ): DocumentationService {
    return new DocumentationService(provider);
  }

  private constructor(
    private readonly provider: DocumentationAssetProvider,
  ) {}

  read<Url extends DocumentationAssetUrl>(url: Url) {
    return this.provider.read(url);
  }
}
