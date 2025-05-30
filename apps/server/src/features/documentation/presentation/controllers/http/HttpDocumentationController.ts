import { resolve } from "@nimir/framework";
import { ServerConfiguration } from "@server/configurations/ServerConfiguration.ts";
import { OpenApiNs } from "@server/core/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/core/infrastructure/routing/routes/decorators/RouteNs.ts";
import { HttpHtmlResponse } from "@server/core/presentation/messaging/http/responses/HttpHtmlResponse.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { DocumentationService } from "@server/features/documentation/application/services/DocumentationService.ts";
import { HttpStaticFileResponse } from "@server/features/static/presentation/messaging/http/responses/HttpStaticFileResponse.ts";
import { DocumentationAssetUrl } from "../../../infrastructure/DocumentationAssetUrl.ts";
import { DocumentationGenerator } from "../../../infrastructure/DocumentationGenerator.ts";
import { HttpDocumentationResponse } from "../../messaging/http/HttpDocumentationResponse.ts";

@ControllerNs.controller({ name: "Documentation", group: "docs" })
export class HttpDocumentationController {
  static create(
    openApi = resolve(DocumentationGenerator),
    documentation = resolve(DocumentationService),
  ) {
    return new HttpDocumentationController(openApi, documentation);
  }

  private constructor(
    private readonly generator: DocumentationGenerator,
    private readonly service: DocumentationService,
  ) {}

  @RouteNs.get("")
  @OpenApiNs.route({
    summary: "Get the documentation index HTML",
    description: "Get the documentation as HTML.",
    tags: [OpenApiTag.Documentation],
    responses: [HttpStaticFileResponse.Missing, HttpHtmlResponse.Content],
  })
  async index() {
    const path = DocumentationAssetUrl.Index;
    const file = await this.service.read(path);

    if (file === undefined) {
      return HttpStaticFileResponse.missing({ path });
    }

    return HttpHtmlResponse.content(file.content);
  }

  @RouteNs.get("/")
  @OpenApiNs.route({
    summary: "Get the root of the server",
    description: "Get the root of the server.",
    tags: [OpenApiTag.Documentation],
    responses: [HttpJsonResponse.Shapeless],
  })
  root() {
    return HttpJsonResponse.shapeless({
      message: "Visit the documentation at /docs",
      documentation: `http://${ServerConfiguration.hostname}:${ServerConfiguration.port}/docs`,
    });
  }

  @RouteNs.get("openapi-spec.json")
  @OpenApiNs.route({
    summary: "Get the OpenAPI specification JSON",
    description: "Get the OpenAPI specification as JSON.",
    tags: [OpenApiTag.Documentation],
    responses: [HttpDocumentationResponse.Content],
  })
  spec() {
    return HttpDocumentationResponse.content(this.generator.generate());
  }
}
