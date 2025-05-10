import { serializeSearchParams } from "@plugin/infrastructure/serializers/serializeSearchParams.ts";
import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

export namespace SyncEventClient {
  const url = ClientUrl.sync + "/sync";
  const scanUrl = url + "/db/scan";
  export const scan = () => ky.post(scanUrl);

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

  const eventsUrl = url + "/events";
  export const events = (params?: { events?: EventType[]; since?: number; limit?: number }) =>
    ky.get<(IndexUpdateEvent | Event)[]>(eventsUrl, { searchParams: serializeSearchParams(params) }).json();
}
