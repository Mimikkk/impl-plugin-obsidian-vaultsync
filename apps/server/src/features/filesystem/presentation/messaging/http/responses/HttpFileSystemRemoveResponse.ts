import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";

export namespace HttpFileSystemRemoveResponse {
  export const [Failure, failure] = HttpJsonResponse.custom({
    content: () => ({ error: "Failed to remove file" }),
    name: "RemoveFailure",
    description: "Failed to remove file",
    example: { error: "Failed to remove file" },
    status: 500,
    schema: { type: "object", properties: { error: { type: "string" } } },
  });

  export const [Success, success] = HttpJsonResponse.custom({
    content: () => ({ success: "File removed successfully" }),
    name: "RemoveSuccess",
    description: "File removed successfully",
    example: { success: "File removed successfully" },
    status: 200,
    schema: { type: "object", properties: { success: { type: "string" } } },
  });
}
