import { resolve } from "@nimir/framework";
import { OpenApiNs } from "@server/core/infrastructure/openapi/decorators/OpenApiNs.ts";
import { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import type { RouteRequestContext } from "@server/core/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";
import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { RouteNs } from "@server/core/infrastructure/routing/routes/decorators/RouteNs.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { EventService } from "@server/features/events/application/services/EventService.ts";
import { HttpEventQueryParameter } from "../../messaging/http/parameters/HttpEventQueryParameter.ts";
import { HttpEventResponse } from "@server/features/events/presentation/messaging/http/responses/HttpEventResponse.ts";

@ControllerNs.controller({ name: "Events", group: "events" })
export class HttpEventController {
  static create(service = resolve(EventService)) {
    return new HttpEventController(service);
  }

  private constructor(private readonly service: EventService) {}

  @RouteNs.post("scan")
  @OpenApiNs.route({
    summary: "Scan the events of the server",
    description: "Scan the events of the server",
    tags: [OpenApiTag.Events],
    responses: [HttpEventResponse.Ok],
  })
  async scan() {
    await this.service.scan({ folder: "default" });
    return HttpEventResponse.ok();
  }

  @RouteNs.get("pool")
  @OpenApiNs.route({
    summary: "Get the pool of events of the server",
    description: "Get the pool of events of the server (60 seconds)",
    tags: [OpenApiTag.Events],
    responses: [HttpEventResponse.Events],
    queryParameters: [HttpEventQueryParameter.Since, HttpEventQueryParameter.Limit, HttpEventQueryParameter.Type],
  })
  async pool(
    { queryParameters: { values } }: RouteRequestContext<
      { since: string; limit: string; type: string }
    >,
  ) {
    const since = +values?.since;
    const limit = +values?.limit;
    const events = values?.type.split(",");

    const result = await this.service.pool({ since, limit, events });

    return HttpEventResponse.events(result);
  }

  @RouteNs.get("latest")
  @OpenApiNs.route({
    summary: "Get the latest event of the server",
    description: "Get the latest event of the server",
    tags: [OpenApiTag.Events],
    responses: [HttpEventResponse.Event, HttpJsonResponse.Missing],
  })
  async latest() {
    const result = await this.service.latest();

    if (result === undefined) {
      return HttpJsonResponse.missing();
    }

    return HttpEventResponse.event(result);
  }
}
