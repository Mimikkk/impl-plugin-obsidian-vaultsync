import { OpenApiNs } from "@server/core/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/core/infrastructure/routing/routes/decorators/RouteNs.ts";
import { HttpHealthResponse } from "../../messaging/http/responses/HttpHealthResponse.ts";

@ControllerNs.controller({ name: "Health", group: "health" })
export class HttpHealthController {
  static create() {
    return new HttpHealthController();
  }

  private constructor() {}

  @RouteNs.get("")
  @OpenApiNs.route({
    summary: "Get the health of the server",
    description: "Get the health of the server",
    tags: [OpenApiTag.Health],
    responses: [HttpHealthResponse.Ok],
  })
  get() {
    return HttpHealthResponse.ok();
  }
}
