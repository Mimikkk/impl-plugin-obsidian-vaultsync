import { serializeSearchParams, singleton } from "@nimir/framework";
import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

@singleton
export class SyncthingEventClient {
  static create(
    url: string = ClientUrl.sync,
    headers: HeadersInit = { "X-API-Key": EnvironmentConfiguration.syncthingApiKey },
  ) {
    return new SyncthingEventClient(url, headers);
  }

  private constructor(
    private readonly url: string,
    private readonly headers: HeadersInit,
  ) {}

  scan(params: SyncthingEventClientNs.ScanParams) {
    return ky.post(this.url + "/db/scan", { json: params, headers: this.headers });
  }

  events(params?: SyncthingEventClientNs.PoolParams) {
    return ky.get<(SyncthingEventClientNs.IndexUpdateEvent | SyncthingEventClientNs.Event)[]>(this.url + "/events", {
      searchParams: serializeSearchParams(params),
      headers: this.headers,
    }).json();
  }
}

export namespace SyncthingEventClientNs {
  export interface ScanParams {
    folder: string;
  }

  export interface PoolParams {
    events?: EventType[];
    since?: number;
    limit?: number;
  }

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
}
