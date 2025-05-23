import { QueryParameter } from "@server/core/presentation/messaging/http/parameters/QueryParameter.ts";

export namespace HttpFileQueryParameter {
  export const Path = QueryParameter.string({
    name: "path",
    description: "The path to the file",
    example: "test.txt",
  });

  export const Recursive = QueryParameter.boolean({
    name: "recursive",
    description: "Whether to remove the file recursively",
    example: false,
  });
}
