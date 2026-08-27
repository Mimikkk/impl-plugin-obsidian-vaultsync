import { singleton } from "@nimir/framework";
import { TimeMs } from "@nimir/shared";
import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import { FileWatch } from "@server/core/infrastructure/files/watchers/FileWatcher.ts";
import { FileWatcherHandlers } from "@server/core/infrastructure/files/watchers/FileWatcherHandlers.ts";
import type { FsEvent } from "@server/core/infrastructure/files/watchers/FsEvent.ts";
import { mkdir } from "node:fs/promises";
import { relative, sep } from "node:path";

@singleton
export class EventService {
  static create() {
    const service = new EventService();
    service.listen();
    return service;
  }

  private constructor(
    private readonly log: EventServiceNs.Event[] = [],
    private readonly waiters = new Set<(events: EventServiceNs.Event[]) => void>(),
  ) {}

  private sequence = 0;

  async scan(_params?: EventServiceNs.ScanParams) {
    this.push([]);
  }

  async pool(params?: EventServiceNs.PoolParams): Promise<EventServiceNs.Event[]> {
    const since = params?.since ?? 0;
    const limit = params?.limit && params.limit > 0 ? params.limit : 100;
    const types = params?.events;

    const available = this.since(since, limit, types);
    if (available.length > 0) return available;

    return await new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.waiters.delete(wake);
        resolve(this.since(since, limit, types));
      }, TimeMs.seconds(60));

      const wake = (events: EventServiceNs.Event[]) => {
        clearTimeout(timer);
        this.waiters.delete(wake);
        resolve(events.slice(0, limit));
      };

      this.waiters.add(wake);
    });
  }

  async latest(): Promise<EventServiceNs.Event | undefined> {
    return this.log.at(-1);
  }

  private listen() {
    const root = EnvironmentConfiguration.storageUrl;
    mkdir(root, { recursive: true }).then(() => {
      FileWatch.start(root, {
        handlers: [
          FileWatcherHandlers.debounce({
            debounceMs: 200,
            onEvent: (event) => this.onWatch(root, event),
          }),
        ],
      }).catch((error) => console.error("storage watch failed:", error));
    });
  }

  private onWatch(root: string, event: FsEvent) {
    const filenames = event.paths
      .map((path) => relative(root, path).split(sep).join("/"))
      .filter((path) => path && !path.startsWith(".."));
    this.push(filenames);
  }

  private push(filenames: string[]) {
    this.sequence += 1;
    const event: EventServiceNs.IndexUpdateEvent = {
      id: this.sequence,
      globalID: String(this.sequence),
      createdAt: new Date().toISOString(),
      type: "LocalIndexUpdated",
      data: { folder: "default", filenames, items: filenames.length, sequence: this.sequence },
    };

    this.log.push(event);
    if (this.log.length > 1000) this.log.splice(0, this.log.length - 1000);

    for (const waiter of Array.from(this.waiters)) waiter([event]);
  }

  private since(since: number, limit: number, types?: EventServiceNs.EventType[]) {
    return this.log
      .filter(
        (event) =>
          event.id > since &&
          (types === undefined || types.length === 0 || types.includes(event.type)),
      )
      .slice(0, limit);
  }
}

export namespace EventServiceNs {
  export interface ScanParams {
    folder?: string;
  }

  export interface PoolParams {
    events?: EventType[];
    since?: number;
    limit?: number;
  }

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
}
