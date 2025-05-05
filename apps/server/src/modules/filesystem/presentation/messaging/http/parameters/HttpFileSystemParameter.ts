import { QueryParameter } from "@server/presentation/messaging/http/parameters/QueryParameter.ts";

export namespace HttpFileSystemParameter {
  export const Path = QueryParameter.string({
    name: "path",
    description: "The path to the file",
    example: "test.txt",
  });
}
