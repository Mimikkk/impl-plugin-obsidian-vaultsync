import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { DocumentationGenerator } from "@server/features/documentation/infrastructure/DocumentationGenerator.ts";

export namespace HttpDocumentationResponse {
  export const [Content, content] = HttpJsonResponse.content({
    example: DocumentationGenerator.initial,
    description: "The OpenAPI specification",
    name: "OpenAPI Specification",
    schema: { type: "object" },
  });
}
