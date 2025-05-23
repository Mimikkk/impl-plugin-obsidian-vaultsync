import { OpenApiControllerNs } from "@server/core/infrastructure/openapi/decorators/OpenApiControllerNs.ts";
import { OpenApiResponseNs } from "@server/core/infrastructure/openapi/decorators/OpenApiResponseNs.ts";
import { OpenApiRouteNs } from "@server/core/infrastructure/openapi/decorators/OpenApiRouteNs.ts";

export namespace OpenApiNs {
  export const controller = OpenApiControllerNs.decorate;
  export const response = OpenApiResponseNs.decorate;
  export const route = OpenApiRouteNs.decorate;
}
