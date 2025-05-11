import { FileInfoResource } from "@server/presentation/messaging/http/resources/FileInfoResource.ts";
import { HttpJsonResponse } from "@server/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { today } from "@server/shared/consts.ts";

export namespace HttpFileSystemStatsResponse {
  export const [Info, info] = HttpJsonResponse.custom({
    content: FileInfoResource.fromFileInfo,
    example: { createdAt: today.toISOString(), updatedAt: today.toISOString(), size: 100 },
    name: "File Info",
    schema: {
      type: "object",
      properties: {
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        size: { type: "number", format: "bytes" },
      },
    },
    status: 200,
    description: "The info of the file",
  });
}
