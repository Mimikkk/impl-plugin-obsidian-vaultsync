import type { Awaitable } from "@nimir/shared";
import type { FileDescriptor, FileInfo } from "@plugin/core/domain/types/FileDescriptor.ts";

export interface FilesystemProvider {
  list(): Awaitable<FileDescriptor[]>;
  info(path: string): Awaitable<FileInfo | undefined>;
  read(path: string): Awaitable<ArrayBuffer | undefined>;
  update(path: string, content: ArrayBuffer): Awaitable<void>;
  remove(path: string): Awaitable<void>;
}
