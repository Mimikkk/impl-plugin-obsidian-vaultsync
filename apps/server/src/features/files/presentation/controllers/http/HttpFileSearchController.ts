import { resolve } from "@nimir/framework";
import { OpenApiNs } from "@server/core/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import type { RouteRequestContext } from "@server/core/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/core/infrastructure/routing/routes/decorators/RouteNs.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { HttpFileQueryParameter } from "@server/features/files/presentation/messaging/http/parameters/HttpFileQueryParameter.ts";
import { FileSearchService } from "../../../application/services/FileSearchService.ts";
import { HttpFileSearchResponse } from "../../messaging/http/responses/HttpFileSearchResponse.ts";

@ControllerNs.controller({ name: "Files", group: "files/search" })
export class HttpFileSearchController {
  static create(service = resolve(FileSearchService)) {
    return new HttpFileSearchController(service);
  }

  private constructor(private readonly service: FileSearchService) {}

  @RouteNs.get("list")
  @OpenApiNs.route({
    summary: "List the files in the folder",
    description: "List the files in the folder",
    tags: [OpenApiTag.Files],
    responses: [HttpFileSearchResponse.List],
  })
  async list() {
    const files = await this.service.list({ folder: "default" });

    return HttpFileSearchResponse.list(files);
  }

  @RouteNs.get("meta")
  @OpenApiNs.route({
    summary: "Get the metadata of the file",
    description: "Get the metadata of the file",
    tags: [OpenApiTag.Files],
    responses: [HttpFileSearchResponse.Info],
    queryParameters: [HttpFileQueryParameter.Path],
  })
  async info({ queryParameters: { values } }: RouteRequestContext<{}, { path: string }>) {
    const { path } = values;

    const file = await this.service.info({ folder: "default", file: path });

    if (!file) {
      return HttpJsonResponse.missing();
    }

    return HttpFileSearchResponse.info({ deleted: file.deleted, deletedAt: file.modified });
  }
}
