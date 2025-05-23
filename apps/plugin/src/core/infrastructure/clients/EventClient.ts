import { serializeSearchParams, singleton } from "@nimir/framework";
import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

@singleton
export class EventClient {
  static create(url: string = ClientUrl.sync + "/events") {
    return new EventClient(url);
  }

  private constructor(private readonly url: string) {}

  scan() {
    return ky.post(this.url + "/scan");
  }

  events(params?: EventClientNs.PoolParams) {
    return ky
      .get(this.url + "/pool", { searchParams: serializeSearchParams(params) })
      .json<EventClientNs.Event[]>();
  }

  async latest() {
    return await ky.get(this.url + "/latest").json<EventClientNs.Event>().catch(() => undefined);
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

  export interface PoolParams {
    events?: EventType[];
    since?: number;
    limit?: number;
  }
}
