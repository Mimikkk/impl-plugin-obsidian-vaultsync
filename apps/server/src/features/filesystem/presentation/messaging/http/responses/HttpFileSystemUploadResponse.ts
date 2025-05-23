import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";

export namespace HttpFileSystemUploadResponse {
  export const [Failure, failure] = HttpJsonResponse.custom({
    content: () => ({ error: "Failed to upload file" }),
    name: "UploadFailure",
    description: "Failed to upload file",
    example: { error: "Failed to upload file" },
    status: 500,
    schema: { type: "object", properties: { error: { type: "string" } } },
  });

  export const [Success, success] = HttpJsonResponse.custom({
    content: () => ({ success: "File uploaded successfully" }),
    name: "UploadSuccess",
    description: "File uploaded successfully",
    example: { success: "File uploaded successfully" },
    status: 200,
    schema: { type: "object", properties: { success: { type: "string" } } },
  });
}
