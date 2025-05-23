import type { EventServiceNs } from "@server/features/events/application/services/EventService.ts";

export interface HttpEventResource {
  id: number;
  type: string;
  createdAt: string;
}

export namespace HttpEventResource {
  export const fromEvent = (event: EventServiceNs.Event): HttpEventResource => ({
    id: event.id,
    type: event.type,
    createdAt: event.createdAt,
  });

  export const fromEvents = (events: EventServiceNs.Event[]): HttpEventResource[] => events.map(fromEvent);

  export const example = {
    id: 1,
    type: "LocalIndexUpdated",
    createdAt: "2021-01-01T00:00:00.000Z",
  };
}
