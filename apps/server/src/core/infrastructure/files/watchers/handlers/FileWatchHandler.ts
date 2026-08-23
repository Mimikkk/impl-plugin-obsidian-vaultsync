import type { Awaitable } from "@nimir/shared";
import type { FsEvent } from "@server/core/infrastructure/files/watchers/FsEvent.ts";

export interface FileWatchHandler {
  handle(event: FsEvent): Awaitable<void>;
}

export type FileWatchHandle = (event: FsEvent) => Awaitable<void>;
