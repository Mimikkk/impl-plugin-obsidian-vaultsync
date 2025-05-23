import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { HttpEventResource } from "@server/features/events/presentation/messaging/http/resources/HttpEventResource.ts";

export namespace HttpEventResponse {
  export const [Ok, ok] = HttpJsonResponse.custom({
    content: () => ({ status: "OK", message: "The scan is done." }),
    description: "The events of the server",
    example: { status: "OK", message: "The scan is done." },
    name: "Events",
    schema: { type: "object", properties: { status: { type: "string" }, message: { type: "string" } } },
    status: 200,
  });

  export const [Event, event] = HttpJsonResponse.custom({
    content: HttpEventResource.fromEvent,
    description: "The event of the server",
    example: HttpEventResource.example,
    name: "Event",
    schema: {},
    status: 200,
  });

  export const [Events, events] = HttpJsonResponse.custom({
    content: HttpEventResource.fromEvents,
    description: "The events of the server",
    example: [HttpEventResource.example],
    name: "Events",
    schema: {},
    status: 200,
  });
}
