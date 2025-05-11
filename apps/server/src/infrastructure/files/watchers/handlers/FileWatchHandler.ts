import type { Awaitable } from "@nimir/shared";

export interface FileWatchHandler {
  handle(event: Deno.FsEvent): Awaitable<void>;
}

export type FileWatchHandle = (event: Deno.FsEvent) => Awaitable<void>;
