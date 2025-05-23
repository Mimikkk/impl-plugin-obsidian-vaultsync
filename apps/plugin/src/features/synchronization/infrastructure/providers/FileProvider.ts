import { resolve, singleton } from "@nimir/framework";
import type { Awaitable } from "@nimir/shared";
import { type FileDescriptor, type FileInfo, FileType } from "@plugin/core/domain/types/FileDescriptor.ts";
import {
  FileGrouper,
  type FileGrouperNs,
} from "@plugin/features/synchronization/infrastructure/groupers/FileGrouper.ts";
import type { FilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/FilesystemProvider.ts";
import {
  LocalFilesystemProvider,
} from "@plugin/features/synchronization/infrastructure/providers/LocalFilesystemProvider.ts";
import {
  RemoteFilesystemProvider,
} from "@plugin/features/synchronization/infrastructure/providers/RemoteFilesystemProvider.ts";

@singleton
export class FileProvider {
  static create(
    locals = resolve(LocalFilesystemProvider),
    remotes = resolve(RemoteFilesystemProvider),
    grouper = resolve(FileGrouper),
  ) {
    return new FileProvider(locals, remotes, grouper);
  }

  private constructor(
    private readonly locals: LocalFilesystemProvider,
    private readonly remotes: RemoteFilesystemProvider,
    private readonly grouper: FileGrouper,
  ) {}

  async byLocation(): Promise<FileGrouperNs.LocationGroups> {
    return this.grouper.byLocation(await this.list());
  }

  async list(): Promise<FileDescriptor[]> {
    const local = this.locals.list();
    const remote = this.remotes.list();
    const files = await Promise.all([local, remote]);

    return files.flat();
  }

  info(descriptor: FileDescriptor): Awaitable<FileInfo | undefined> {
    return this.filesystem(descriptor).info(descriptor.path);
  }

  read(descriptor: FileDescriptor): Awaitable<ArrayBuffer | undefined> {
    return this.filesystem(descriptor).read(descriptor.path);
  }

  private filesystem(descriptor: FileDescriptor): FilesystemProvider {
    if (descriptor.type === FileType.Local) {
      return this.locals;
    }

    return this.remotes;
  }
}
