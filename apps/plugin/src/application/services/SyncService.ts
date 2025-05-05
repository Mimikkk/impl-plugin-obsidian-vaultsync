import { serializeSearchParams } from "@plugin/infrastructure/serializers/serializeSearchParams.ts";
import ky from "ky";
import { ServiceUrl } from "./ServiceUrl.ts";

export namespace SyncService {
  const url = ServiceUrl.sync + "/sync";

  export const download = (path: string) => ky.get(url + "/db/get", { searchParams: { path } });

  export const folders = () => ky.get(url + "/config/folders").json();

  export const get = <T>(extra: string, payload: any, params: any) =>
    ky.get(url + "/" + extra, { json: payload, searchParams: serializeSearchParams(params) }).json<T>();

  export const post = <T>(extra: string, payload: any, params: any) =>
    ky.post(url + "/" + extra, { json: payload, searchParams: serializeSearchParams(params) }).json<T>();

  const scanUrl = url + "/db/scan";
  export const scan = () => ky.post(scanUrl);

  const eventsUrl = url + "/events";
  export const events = (params?: { events?: EventType[]; since?: number; limit?: number }) =>
    ky.get<(IndexUpdateEvent | Event)[]>(eventsUrl, { searchParams: serializeSearchParams(params) }).json();

  export type EventType = "LocalIndexUpdated" | "LocalChangeDetected";
  export interface Event<E extends EventType = EventType, T = unknown> {
    id: number;
    globalID: string;
    createdAt: string;
    type: E;
    data: T;
  }

  /** @see {@link https://docs.syncthing.net/events/localindexupdated.html|Syncthing event: LocalIndexUpdated} */
  export type IndexUpdateEvent = Event<"LocalIndexUpdated", {
    folder: string;
    filenames: string[];
    items: number;
    sequence: number;
  }>;
}
