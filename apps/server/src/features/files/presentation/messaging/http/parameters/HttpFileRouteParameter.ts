import { RouteParameter } from "@server/core/presentation/messaging/http/parameters/RouteParameter.ts";

export namespace HttpFileRouteParameter {
  export const path = RouteParameter.string({
    description: "The path of the file",
    example: "default/test.txt",
    name: "path",
  });
}
