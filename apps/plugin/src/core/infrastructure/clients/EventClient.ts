import { defineClient, TimeMs } from "@nimir/shared";
import { ClientUrl } from "./ClientUrl.ts";

export type EventType = "LocalIndexUpdated" | "LocalChangeDetected";
export interface Event<E extends EventType = EventType, T = unknown> {
  id: number;
  globalID: string;
  createdAt: string;
  type: E;
  data: T;
}

export type IndexUpdateEvent = Event<
  "LocalIndexUpdated",
  {
    folder: string;
    filenames: string[];
    items: number;
    sequence: number;
  }
>;

export interface PoolParams {
  events?: EventType[];
  since?: number;
  limit?: number;
}

export const EventClient = defineClient({
  service: ClientUrl.sync,
  methods: ({ methods, types }) => ({
    scan: methods.post({
      path: "/events/scan",
      result: types.shape<{ message: string; status: number }>,
    }),
    events: methods.get({
      path: "/events/pool",
      params: (params: PoolParams) => ({
        since: params.since,
        limit: params.limit,
        type: params.events?.join(","),
      }),
      result: types.shape<Event[]>,
      ky: () => ({ timeout: TimeMs.seconds(65) }),
    }),
    latest: methods.get({
      path: "/events/latest",
      result: types.shape<Event | undefined>,
      onError: () => undefined,
    }),
  }),
});
