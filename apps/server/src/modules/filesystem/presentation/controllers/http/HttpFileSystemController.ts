import { OpenApiNs } from "@server/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/infrastructure/openapi/OpenApiTag.ts";
import { ControllerNs } from "@server/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/infrastructure/routing/routes/decorators/RouteNs.ts";
import { HttpJsonResponse } from "@server/presentation/messaging/http/responses/HttpJsonResponse.ts";

@ControllerNs.controller({ name: "FileSystem", group: "filesystem" })
export class HttpFileSystemController {
  static create() {
    return new HttpFileSystemController();
  }

  private constructor() {}

  @RouteNs.get("")
  @OpenApiNs.route({
    summary: "Get the health of the server",
    description: "Get the health of the server",
    tags: [OpenApiTag.FileSystem],
    responses: [],
  })
  async get() {
    return HttpJsonResponse.success();
  }

  @RouteNs.get("/:id")
  @OpenApiNs.route({
    summary: "Get the health of the server",
    description: "Get the health of the server",
    tags: [OpenApiTag.FileSystem],
    responses: [],
  })
  async list() {
    return HttpJsonResponse.success();
  }
}
