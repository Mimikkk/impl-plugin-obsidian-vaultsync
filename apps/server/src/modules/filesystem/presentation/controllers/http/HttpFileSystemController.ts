import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import { FileSystemReader } from "@server/infrastructure/files/readers/FileSystemReader.ts";
import { OpenApiNs } from "@server/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/infrastructure/openapi/OpenApiTag.ts";
import type { RouteRequestContext } from "@server/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";
import { ControllerNs } from "@server/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/infrastructure/routing/routes/decorators/RouteNs.ts";
import { PathSanitizer } from "../../../infrastructure/files/PathSanitizer.ts";
import { HttpFileSystemParameter } from "../../messaging/http/parameters/HttpFileSystemParameter.ts";
import { HttpFileSystemResponse } from "../../messaging/http/responses/HttpFileSystemResponse.ts";

@ControllerNs.controller({ name: "FileSystem", group: "filesystem" })
export class HttpFileSystemController {
  static create() {
    return new HttpFileSystemController();
  }

  private constructor(
    private readonly reader = FileSystemReader.create(EnvironmentConfiguration.storageUrl),
    private readonly sanitizer = PathSanitizer.create(),
  ) {}

  @RouteNs.get("")
  @OpenApiNs.route({
    summary: "Get the file from the server",
    description: "Get the file from the server",
    tags: [OpenApiTag.FileSystem],
    responses: [
      HttpFileSystemResponse.Missing,
      HttpFileSystemResponse.Absolute,
      HttpFileSystemResponse.Traversal,
      HttpFileSystemResponse.File,
    ],
    queryParameters: [HttpFileSystemParameter.Path],
  })
  async get(context: RouteRequestContext<{}, { path: string }>) {
    const result = this.sanitizer.sanitize(context.queryParameters.values.path);

    if ("error" in result) {
      if (result.error === "absolute-path") {
        return HttpFileSystemResponse.absolute();
      }

      return HttpFileSystemResponse.traversal();
    }

    const file = await this.reader.readU8(result.value);
    if (file === undefined) {
      return HttpFileSystemResponse.missing();
    }

    return HttpFileSystemResponse.file(file);
  }
}
