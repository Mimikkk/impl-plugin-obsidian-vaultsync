import { QueryParameter } from "@server/presentation/messaging/http/parameters/QueryParameter.ts";

export namespace HttpFileSystemParameter {
  export const Path = QueryParameter.string({
    name: "path",
    description: "The path to the file",
    example: "test.txt",
    required: true,
  });

  export const Recursive = QueryParameter.boolean({
    name: "recursive",
    description: "Whether to remove the file recursively",
    example: false,
  });
}
