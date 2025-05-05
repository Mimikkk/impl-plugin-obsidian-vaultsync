import { OpenApiNs } from "@server/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/infrastructure/openapi/OpenApiTag.ts";
import type { RouteRequestContext } from "@server/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";
import { ControllerNs } from "@server/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/infrastructure/routing/routes/decorators/RouteNs.ts";
import { HttpFileSystemRemoveResponse } from "@server/modules/filesystem/presentation/messaging/http/responses/HttpFileSystemRemoveResponse.ts";
import { RequestContent } from "@server/presentation/messaging/http/content/RequestContent.ts";
import { HttpFileSystemService } from "../../../application/HttpFileSystemService.ts";
import { HttpFileSystemParameter } from "../../messaging/http/parameters/HttpFileSystemParameter.ts";
import { HttpFileSystemReadResponse } from "../../messaging/http/responses/HttpFileSystemReadResponse.ts";
import { HttpFileSystemUploadResponse } from "../../messaging/http/responses/HttpFileSystemUploadResponse.ts";

@ControllerNs.controller({ name: "FileSystem", group: "filesystem" })
export class HttpFileSystemController {
  static create() {
    return new HttpFileSystemController();
  }

  private constructor(
    private readonly service = HttpFileSystemService.create(),
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

    const mime = this.service.mime(path);
    const response = HttpFileSystemReadResponse.file(result);
    response.headers.set("Content-Type", mime);

    return response;
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
  async upload(context: RouteRequestContext<{}, {}, { path: string; file: Uint8Array }>) {
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
