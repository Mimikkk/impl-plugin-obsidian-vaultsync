import { HttpFileResponse } from "@server/core/presentation/messaging/http/responses/HttpFileResponse.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";

export namespace HttpFileSystemReadResponse {
  export const [File, file] = HttpFileResponse.custom({
    name: "File",
    description: "File",
    example: new Uint8Array(),
    status: 200,
    schema: { type: "string", format: "binary" },
  });

  export const [Missing, missing] = HttpJsonResponse.custom({
    content: () => ({ error: "File not found" }),
    name: "Missing",
    description: "File not found",
    example: { error: "File not found" },
    status: 404,
    schema: { type: "object", properties: { error: { type: "string" } } },
  });

  export const [Absolute, absolute] = HttpJsonResponse.custom({
    content: () => ({ error: "Absolute paths are not allowed" }),
    name: "Absolute",
    description: "Absolute paths are not allowed",
    example: { error: "Absolute paths are not allowed" },
    status: 400,
    schema: { type: "object", properties: { error: { type: "string" } } },
  });

  export const [Traversal, traversal] = HttpJsonResponse.custom({
    content: () => ({ error: "Path traversal is not allowed" }),
    name: "Traversal",
    description: "Path traversal is not allowed",
    example: { error: "Path traversal is not allowed" },
    status: 400,
    schema: { type: "object", properties: { error: { type: "string" } } },
  });

  export const [List, list] = HttpJsonResponse.custom({
    content: (names: string[]) => ({ files: names }),
    name: "List",
    description: "List of files",
    example: { files: ["test.txt", "test2.txt"] },
    status: 200,
    schema: { type: "object", properties: { files: { type: "array", items: { type: "string" } } } },
  });
}
