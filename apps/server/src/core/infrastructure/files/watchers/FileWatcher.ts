import { watch } from "node:fs/promises";
import type { FileWatchHandler } from "@server/core/infrastructure/files/watchers/handlers/FileWatchHandler.ts";
import type { FsEvent } from "@server/core/infrastructure/files/watchers/FsEvent.ts";
import { resolve } from "node:path";

export interface FileWatcherOptions {
  handlers?: FileWatchHandler[];
}

export class FileWatch {
  static create(path: string, options?: FileWatcherOptions) {
    return new FileWatch(path, options?.handlers || []);
  }

  static start(path: string, options?: FileWatcherOptions) {
    return FileWatch.create(path, options).start();
  }

  private readonly abort = new AbortController();

  constructor(
    public readonly path: string,
    private readonly handlers: FileWatchHandler[],
  ) {}

  async start() {
    try {
      const watcher = watch(this.path, { recursive: true, signal: this.abort.signal });
      for await (const event of watcher) {
        const fsEvent: FsEvent = {
          paths: [event.filename ? resolve(this.path, event.filename) : this.path],
        };
        for (const handler of this.handlers) {
          await handler.handle(fsEvent);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return this;
      throw error;
    }

    return this;
  }

  stop() {
    this.abort.abort();
  }
}
