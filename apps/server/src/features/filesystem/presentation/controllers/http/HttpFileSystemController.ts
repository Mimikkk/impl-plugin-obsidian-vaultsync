import { resolve } from "@nimir/framework";
import { OpenApiNs } from "@server/core/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import type { RouteRequestContext } from "@server/core/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/core/infrastructure/routing/routes/decorators/RouteNs.ts";
import { RequestContent } from "@server/core/presentation/messaging/http/content/RequestContent.ts";
import { HttpFileSystemRemoveResponse } from "@server/features/filesystem/presentation/messaging/http/responses/HttpFileSystemRemoveResponse.ts";
import { HttpFileSystemService } from "../../../application/HttpFileSystemService.ts";
import { HttpFileSystemParameter } from "../../messaging/http/parameters/HttpFileSystemParameter.ts";
import { HttpFileSystemExistsResponse } from "../../messaging/http/responses/HttpFileSystemExistsResponse.ts";
import { HttpFileSystemReadResponse } from "../../messaging/http/responses/HttpFileSystemReadResponse.ts";
import { HttpFileSystemStatsResponse } from "../../messaging/http/responses/HttpFileSystemStatsResponse.ts";
import { HttpFileSystemUploadResponse } from "../../messaging/http/responses/HttpFileSystemUploadResponse.ts";

@ControllerNs.controller({ name: "FileSystem", group: "filesystem" })
export class HttpFileSystemController {
  static create(
    service = resolve(HttpFileSystemService),
  ) {
    return new HttpFileSystemController(service);
  }

  private constructor(
    private readonly service: HttpFileSystemService,
  ) {}

  @RouteNs.get("")
  @OpenApiNs.route({
    summary: "Get the file from the server",
    description: "Get the file from the server",
    tags: [OpenApiTag.FileSystem],
    responses: [
      HttpFileSystemReadResponse.Missing,
      HttpFileSystemReadResponse.Absolute,
      HttpFileSystemReadResponse.Traversal,
      HttpFileSystemReadResponse.File,
    ],
    queryParameters: [HttpFileSystemParameter.Path],
  })
  async get(context: RouteRequestContext<{}, { path: string }>) {
    const { path } = context.queryParameters.values;

    const result = await this.service.read(path);

    if (result === "absolute-path") {
      return HttpFileSystemReadResponse.absolute();
    }

    if (result === "path-traversal") {
      return HttpFileSystemReadResponse.traversal();
    }

    if (result === "missing") {
      return HttpFileSystemReadResponse.missing();
    }

    const response = HttpFileSystemReadResponse.file(result.content);
    response.headers.set("Content-Type", result.mime);
    response.headers.set("Content-Disposition", `attachment; filename="${result.path}"`);
    response.headers.set("Content-Length", result.content.length.toString());
    response.headers.set("Content-Transfer-Encoding", "binary");

    return response;
  }

  @RouteNs.get("info")
  @OpenApiNs.route({
    summary: "Get the info of the file",
    description: "Get the info of the file",
    tags: [OpenApiTag.FileSystem],
    responses: [
      HttpFileSystemReadResponse.Missing,
      HttpFileSystemReadResponse.Absolute,
      HttpFileSystemReadResponse.Traversal,
      HttpFileSystemStatsResponse.Info,
    ],
    queryParameters: [HttpFileSystemParameter.Path],
  })
  async stats(context: RouteRequestContext<{}, { path: string }>) {
    const { path } = context.queryParameters.values;

    const result = await this.service.stats(path);

    if (result === "absolute-path") {
      return HttpFileSystemReadResponse.absolute();
    }

    if (result === "path-traversal") {
      return HttpFileSystemReadResponse.traversal();
    }

    if (result === "missing") {
      return HttpFileSystemReadResponse.missing();
    }

    return HttpFileSystemStatsResponse.info(result);
  }

  @RouteNs.get("exists")
  @OpenApiNs.route({
    summary: "Check if the file exists on the server",
    description: "Check if the file exists on the server",
    tags: [OpenApiTag.FileSystem],
    responses: [
      HttpFileSystemReadResponse.Missing,
      HttpFileSystemReadResponse.Absolute,
      HttpFileSystemReadResponse.Traversal,
      HttpFileSystemExistsResponse.Exists,
    ],
    queryParameters: [HttpFileSystemParameter.Path],
  })
  async exists(context: RouteRequestContext<{}, { path: string }>) {
    const { path } = context.queryParameters.values;

    const result = await this.service.exists(path);

    if (result === "absolute-path") {
      return HttpFileSystemReadResponse.absolute();
    }

    if (result === "path-traversal") {
      return HttpFileSystemReadResponse.traversal();
    }

    return HttpFileSystemExistsResponse.exists(result);
  }

  @RouteNs.get("list")
  @OpenApiNs.route({
    summary: "List the files in the directory",
    description: "List the files in the directory",
    tags: [OpenApiTag.FileSystem],
    responses: [
      HttpFileSystemReadResponse.Missing,
      HttpFileSystemReadResponse.Absolute,
      HttpFileSystemReadResponse.Traversal,
      HttpFileSystemReadResponse.List,
    ],
    queryParameters: [HttpFileSystemParameter.Path],
  })
  async list(context: RouteRequestContext<{}, { path: string }>) {
    const { path = "" } = context.queryParameters.values;

    const result = await this.service.list(path);

    if (result === "absolute-path") {
      return HttpFileSystemReadResponse.absolute();
    }

    if (result === "path-traversal") {
      return HttpFileSystemReadResponse.traversal();
    }

    return HttpFileSystemReadResponse.list(result.filter((name) => !name.startsWith(".")));
  }

  @RouteNs.post("")
  @OpenApiNs.route({
    summary: "Write the file to the server",
    description: "Write the file to the server",
    responses: [
      HttpFileSystemUploadResponse.Failure,
      HttpFileSystemUploadResponse.Success,
      HttpFileSystemReadResponse.Absolute,
      HttpFileSystemReadResponse.Traversal,
    ],
    tags: [OpenApiTag.FileSystem],
    content: RequestContent.create({
      description: "The path to the file to write and the file content",
      example: {
        path: "test.txt",
        file: "test",
      },
      name: "path",
      properties: {
        path: { type: "string" },
        file: { type: "string", format: "binary" },
      },
      required: ["path", "file"],
      type: "multipart/form-data",
    }),
  })
  async upload(context: RouteRequestContext<{}, {}, { path: string; file: File }>) {
    const { path, file } = context.content.values;

    const result = await this.service.write(path, file);

    if (result === "absolute-path") {
      return HttpFileSystemReadResponse.absolute();
    }

    if (result === "path-traversal") {
      return HttpFileSystemReadResponse.traversal();
    }

    if (result === "failure") {
      return HttpFileSystemUploadResponse.failure();
    }

    return HttpFileSystemUploadResponse.success();
  }

  @RouteNs.del("")
  @OpenApiNs.route({
    summary: "Remove the file from the server",
    description: "Remove the file from the server",
    tags: [OpenApiTag.FileSystem],
    responses: [
      HttpFileSystemRemoveResponse.Failure,
      HttpFileSystemRemoveResponse.Success,
      HttpFileSystemReadResponse.Absolute,
      HttpFileSystemReadResponse.Traversal,
    ],
    content: RequestContent.create({
      description: "The path to the file to remove and whether to remove the file recursively",
      example: {
        path: "test.txt",
        recursive: false,
      },
      name: "path",
      properties: {
        path: { type: "string" },
        recursive: { type: "boolean" },
      },
      required: ["path"],
    }),
  })
  async delete(context: RouteRequestContext<{}, {}, { path: string; recursive?: boolean }>) {
    const { path, recursive } = context.content.values;
    const result = await this.service.remove(path, recursive);

    if (result === "absolute-path") {
      return HttpFileSystemReadResponse.absolute();
    }

    if (result === "path-traversal") {
      return HttpFileSystemReadResponse.traversal();
    }

    if (result === "failure") {
      return HttpFileSystemRemoveResponse.failure();
    }

    return HttpFileSystemRemoveResponse.success();
  }
}
