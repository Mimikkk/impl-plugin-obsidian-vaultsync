import { di } from "@nimir/framework";
import type { Awaitable } from "@nimir/shared";
import { type FileDescriptor, type FileInfo, FileType } from "@plugin/core/domain/types/FileDescriptor.ts";
import {
  FileGrouper,
  type FileGrouperNs,
  TFileGrouper,
} from "@plugin/features/synchronization/infrastructure/groupers/FileGrouper.ts";
import type { FilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/FilesystemProvider.ts";
import {
  type LocalFilesystemProvider,
  TLocalFilesystemProvider,
} from "@plugin/features/synchronization/infrastructure/providers/LocalFilesystemProvider.ts";
import {
  type RemoteFilesystemProvider,
  TRemoteFilesystemProvider,
} from "@plugin/features/synchronization/infrastructure/providers/RemoteFilesystemProvider.ts";

export class FileProvider {
  static create(
    locals = di.of(TLocalFilesystemProvider),
    remotes = di.of(TRemoteFilesystemProvider),
    grouper = di.of(TFileGrouper),
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

export const TFileProvider = di.singleton(FileProvider);
