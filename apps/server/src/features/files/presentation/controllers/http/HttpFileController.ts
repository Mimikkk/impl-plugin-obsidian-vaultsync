import { resolve } from "@nimir/framework";
import { OpenApiNs } from "@server/core/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import type { RouteRequestContext } from "@server/core/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/core/infrastructure/routing/routes/decorators/RouteNs.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { FileService } from "@server/features/files/application/services/FileService.ts";
import { HttpFileRouteParameter } from "../../messaging/http/parameters/HttpFileRouteParameter.ts";
import { HttpFileResponse } from "../../messaging/http/responses/HttpFileResponse.ts";

@ControllerNs.controller({ name: "Files", group: "files" })
export class HttpFileController {
  static create(service = resolve(FileService)) {
    return new HttpFileController(service);
  }

  private constructor(private readonly service: FileService) {}

  @RouteNs.get("")
  @OpenApiNs.route({
    summary: "List the files in the folder",
    description: "List the files in the folder",
    tags: [OpenApiTag.Files],
    responses: [HttpFileResponse.List],
  })
  async list() {
    const files = await this.service.list({ folder: "default" });

    return HttpFileResponse.list(files);
  }

  @RouteNs.get(HttpFileRouteParameter.path)
  @OpenApiNs.route({
    summary: "Get the information of the file",
    description: "Get the information of the file",
    tags: [OpenApiTag.Files],
    responses: [HttpFileResponse.Info],
    routeParameters: [HttpFileRouteParameter.path],
  })
  async info({ routeParameters: { values } }: RouteRequestContext<{ path: string }>) {
    const { path } = values;

    const file = await this.service.info({ folder: "default", file: path });

    if (!file) {
      return HttpJsonResponse.missing();
    }

    return HttpFileResponse.info({ deleted: file.deleted, deletedAt: file.modified });
  }
}
