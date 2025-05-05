import { HttpJsonResponse } from "@server/presentation/messaging/http/responses/HttpJsonResponse.ts";

export namespace HttpFileSystemExistsResponse {
  export const [Exists, exists] = HttpJsonResponse.custom({
    content: (exists: boolean) => ({ exists }),
    example: { exists: true },
    name: "Exists",
    description: "File exists",
    status: 200,
    schema: { type: "object", properties: { exists: { type: "boolean" } } },
  });
}
