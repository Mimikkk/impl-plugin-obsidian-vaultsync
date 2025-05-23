import { QueryParameter } from "@server/core/presentation/messaging/http/parameters/QueryParameter.ts";

export namespace HttpEventQueryParameter {
  export const Since = QueryParameter.integer({
    name: "since",
    description: "The since parameter",
    example: 0,
  });

  export const Limit = QueryParameter.integer({
    name: "limit",
    description: "The limit parameter",
    example: 10,
  });

  export const Type = QueryParameter.strings({
    name: "type",
    description: "The type parameter",
    example: ["LocalIndexUpdated"],
    options: ["LocalIndexUpdated", "LocalChangeDetected"],
  });
}
