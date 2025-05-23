import { RouteParameter } from "@server/core/presentation/messaging/http/parameters/RouteParameter.ts";

export namespace HttpStaticParameter {
  export const Path = RouteParameter.string({
    name: "path",
    description: "The path to the static file",
    example: "favicon.ico",
  });
}
