import { OpenApiNs } from "@server/core/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/core/infrastructure/routing/routes/decorators/RouteNs.ts";
import { HealthResponse } from "../../messaging/http/responses/HealthResponse.ts";

@ControllerNs.controller({ name: "Health", group: "health" })
export class HealthController {
  static create() {
    return new HealthController();
  }

  private constructor() {}

  @RouteNs.get("")
  @OpenApiNs.route({
    summary: "Get the health of the server",
    description: "Get the health of the server",
    tags: [OpenApiTag.Health],
    responses: [HealthResponse.Ok],
  })
  get() {
    return HealthResponse.ok();
  }
}
