import { resolve, singleton } from "@nimir/framework";
import { Str } from "@nimir/shared";
import { OpenApiResponseNs } from "@server/core/infrastructure/openapi/decorators/OpenApiResponseNs.ts";
import { OpenApiRouteNs } from "@server/core/infrastructure/openapi/decorators/OpenApiRouteNs.ts";
import { type OpenApiTag, OpenApiTagOrder, OpenApiTags } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { OpenApiBuilder, type OpenAPIObject, type ResponseObject } from "openapi3-ts/oas31";
import { ControllerStore } from "../../../core/infrastructure/routing/controllers/ControllerStore.ts";

@singleton
export class DocumentationGenerator {
  static readonly initial: OpenAPIObject = {
    info: {
      title: "Vault Sync",
      version: "1.0.0",
      description: Str.trimlines`
        Documentation of the API for the vault sync server.
      `,
    },
    openapi: "3.1.1",
  };

  static create(
    controllers = resolve(ControllerStore),
  ): DocumentationGenerator {
    return new DocumentationGenerator(controllers);
  }

  private constructor(
    private readonly controllers: ControllerStore,
  ) {}

  generate(): OpenAPIObject {
    const builder = OpenApiBuilder.create(structuredClone(DocumentationGenerator.initial));

    const controllers = Array.from(this.controllers.keys()).filter(ControllerNs.is) as unknown as ControllerNs.Meta[];

    const usedTags: OpenApiTag[] = [];
    for (const controller of controllers) {
      const meta = ControllerNs.meta(controller);

      for (const route of meta.routes) {
        const openapi = OpenApiRouteNs.get(route.self);
        if (openapi === undefined) continue;

        for (const tag of openapi.tags) {
          if (usedTags.includes(tag)) continue;
          usedTags.push(tag);
        }

        const responses = Object.fromEntries(
          openapi.responses
            .map(OpenApiResponseNs.meta)
            .map((r) => [r.status, {
              description: `<div>${r.description}</div>`,
              content: r.content,
            } as ResponseObject]),
        );

        const method = route.type === "ws" ? "trace" : route.method.toLowerCase() as "get";

        builder.addPath(route.path, {
          [method as "get"]: {
            tags: openapi.tags,
            summary: openapi.summary,
            deprecated: openapi.deprecated,
            description: `<div>${openapi.description}</div>`,
            parameters: [
              ...openapi.routeParameters.map((p) => p.toObject()),
              ...openapi.queryParameters.map((p) => p.toObject()),
            ],
            requestBody: openapi.content?.toObject(),
            responses,
          },
        });
      }
    }

    this.addTags(builder, usedTags);

    return builder.getSpec();
  }

  private addTags(builder: OpenApiBuilder, tags: OpenApiTag[]): OpenApiBuilder {
    for (const tag of tags.sort((a, b) => OpenApiTagOrder.get(a)! - OpenApiTagOrder.get(b)!)) {
      const object = OpenApiTags.get(tag);
      if (object === undefined) continue;

      builder.addTag(object);
    }

    return builder;
  }
}
