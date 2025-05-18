import { ExternalClientUrl } from "@plugin/core/infrastructure/clients/external/ExternalClientUrl.ts";
import { serializeSearchParams } from "@plugin/core/infrastructure/serializers/serializeSearchParams.ts";
import ky from "ky";

export class EventClient {
  static create(url: string = ExternalClientUrl.sync + "/sync") {
    return new EventClient(url);
  }

  private constructor(private readonly url: string) {}

  scan() {
    return ky.post(this.url + "/db/scan", { json: { folder: "default" } });
  }

  events(params?: EventClientNs.PoolOptions) {
    return ky
      .get<(EventClientNs.IndexUpdateEvent | EventClientNs.Event)[]>(this.url + "/events", {
        searchParams: serializeSearchParams(params),
      })
      .json();
  }
}

export namespace EventClientNs {
  /** @see {@link https://docs.syncthing.net/dev/events.html#event-types | Syncthing event types} */
  export type EventType = "LocalIndexUpdated" | "LocalChangeDetected";
  export interface Event<E extends EventType = EventType, T = unknown> {
    id: number;
    globalID: string;
    createdAt: string;
    type: E;
    data: T;
  }

  /** @see {@link https://docs.syncthing.net/events/localindexupdated.html | Syncthing event: LocalIndexUpdated (www)} */
  export type IndexUpdateEvent = Event<"LocalIndexUpdated", {
    folder: string;
    filenames: string[];
    items: number;
    sequence: number;
  }>;

  export interface PoolOptions {
    events?: EventType[];
    since?: number;
    limit?: number;
  }
}
