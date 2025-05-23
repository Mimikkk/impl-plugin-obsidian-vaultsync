import { resolve } from "@nimir/framework";
import { OpenApiNs } from "@server/core/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import type { RouteRequestContext } from "@server/core/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/core/infrastructure/routing/routes/decorators/RouteNs.ts";
import { RequestContent } from "@server/core/presentation/messaging/http/content/RequestContent.ts";
import { FileOperationService } from "../../../application/services/FileOperationService.ts";
import { HttpFileQueryParameter } from "../../messaging/http/parameters/HttpFileQueryParameter.ts";
import { HttpFileOperationReadResponse } from "../../messaging/http/responses/HttpFileOperationReadResponse.ts";
import { HttpFileOperationRemoveResponse } from "../../messaging/http/responses/HttpFileOperationRemoveResponse.ts";
import { HttpFileOperationUploadResponse } from "../../messaging/http/responses/HttpFileOperationUploadResponse.ts";

@ControllerNs.controller({ name: "FileOperations", group: "files/operations" })
export class HttpFileOperationsController {
  static create(
    service = resolve(FileOperationService),
  ) {
    return new HttpFileOperationsController(service);
  }

  private constructor(
    private readonly service: FileOperationService,
  ) {}

  @RouteNs.get("download")
  @OpenApiNs.route({
    summary: "Get the file from the server",
    description: "Get the file from the server",
    tags: [OpenApiTag.FileSystem],
    responses: [
      HttpFileOperationReadResponse.Missing,
      HttpFileOperationReadResponse.Absolute,
      HttpFileOperationReadResponse.Traversal,
      HttpFileOperationReadResponse.File,
    ],
    queryParameters: [HttpFileQueryParameter.Path],
  })
  async download(context: RouteRequestContext<{}, { path: string }>) {
    const { path } = context.queryParameters.values;

    const result = await this.service.read(path);

    if (result === "absolute-path") {
      return HttpFileOperationReadResponse.absolute();
    }

    if (result === "path-traversal") {
      return HttpFileOperationReadResponse.traversal();
    }

    if (result === "missing") {
      return HttpFileOperationReadResponse.missing();
    }

    const response = HttpFileOperationReadResponse.file(result.content);
    response.headers.set("Content-Type", result.mime);
    response.headers.set("Content-Disposition", `attachment; filename="${result.path}"`);
    response.headers.set("Content-Length", result.content.length.toString());
    response.headers.set("Content-Transfer-Encoding", "binary");

    return response;
  }

  @RouteNs.post("upload")
  @OpenApiNs.route({
    summary: "Write the file to the server",
    description: "Write the file to the server",
    responses: [
      HttpFileOperationUploadResponse.Failure,
      HttpFileOperationUploadResponse.Success,
      HttpFileOperationReadResponse.Absolute,
      HttpFileOperationReadResponse.Traversal,
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
      return HttpFileOperationReadResponse.absolute();
    }

    if (result === "path-traversal") {
      return HttpFileOperationReadResponse.traversal();
    }

    if (result === "failure") {
      return HttpFileOperationUploadResponse.failure();
    }

    return HttpFileOperationUploadResponse.success();
  }

  @RouteNs.del("delete")
  @OpenApiNs.route({
    summary: "Remove the file from the server",
    description: "Remove the file from the server",
    tags: [OpenApiTag.FileSystem],
    responses: [
      HttpFileOperationRemoveResponse.Failure,
      HttpFileOperationRemoveResponse.Success,
      HttpFileOperationReadResponse.Absolute,
      HttpFileOperationReadResponse.Traversal,
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
      return HttpFileOperationReadResponse.absolute();
    }

    if (result === "path-traversal") {
      return HttpFileOperationReadResponse.traversal();
    }

    if (result === "failure") {
      return HttpFileOperationRemoveResponse.failure();
    }

    return HttpFileOperationRemoveResponse.success();
  }
}
