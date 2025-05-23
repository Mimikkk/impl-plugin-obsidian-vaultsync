import { resolve } from "@nimir/framework";
import { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import { OpenApiNs } from "@server/core/infrastructure/openapi/decorators/OpenApiNs.ts";
import type { RouteRequestContext } from "@server/core/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/core/infrastructure/routing/routes/decorators/RouteNs.ts";
import { StaticService } from "@server/features/static/application/services/StaticService.ts";
import type { StaticAssetUrl } from "@server/features/static/domain/StaticAssetUrl.ts";
import { HttpStaticParameter } from "@server/features/static/presentation/messaging/http/parameters/HttpStaticParameter.ts";
import { HttpStaticFileResponse } from "@server/features/static/presentation/messaging/http/responses/HttpStaticFileResponse.ts";

@ControllerNs.controller({ name: "Static Assets", group: "static" })
export class HttpStaticController {
  static create(service = resolve(StaticService)) {
    return new HttpStaticController(service);
  }

  private constructor(
    private readonly service: StaticService,
  ) {}

  @RouteNs.get(HttpStaticParameter.Path)
  @OpenApiNs.route({
    summary: "Get a static file",
    description: "Get a static file",
    tags: [OpenApiTag.Static],
    responses: [HttpStaticFileResponse.Missing],
    routeParameters: [HttpStaticParameter.Path],
  })
  file({ routeParameters: { values: { path } } }: RouteRequestContext<{ path: StaticAssetUrl }>) {
    path = decodeURIComponent(path).replace(/:/g, "/") as StaticAssetUrl;
    return this.read(path);
  }

  private async read(path: StaticAssetUrl) {
    const file = await this.service.read(path);

    if (file === undefined) {
      return HttpStaticFileResponse.missing({ path });
    }

    return HttpStaticFileResponse.content(file);
  }
}
