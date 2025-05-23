import { resolve, singleton } from "@nimir/framework";
import type { Awaitable } from "@nimir/shared";
import type { FileSearch } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";
import { LocalFileSearch } from "@plugin/features/synchronization/infrastructure/filesystems/LocalFileSearch.ts";
import { RemoteFileSearch } from "@plugin/features/synchronization/infrastructure/filesystems/RemoteFileSearch.ts";
import {
  FileGrouper,
  type FileGrouperNs,
} from "@plugin/features/synchronization/infrastructure/groupers/FileGrouper.ts";
import { type FileInfo, type FileMeta, FileType } from "../../../../core/domain/types/FileTypes.ts";

@singleton
export class FileProvider {
  static create(
    locals = resolve(LocalFileSearch),
    remotes = resolve(RemoteFileSearch),
    grouper = resolve(FileGrouper),
  ) {
    return new FileProvider(locals, remotes, grouper);
  }

  private constructor(
    private readonly locals: LocalFileSearch,
    private readonly remotes: RemoteFileSearch,
    private readonly grouper: FileGrouper,
  ) {}

  async byLocation(): Promise<FileGrouperNs.LocationGroups> {
    return this.grouper.byLocation(await this.list());
  }

  async list(): Promise<FileInfo[]> {
    const local = this.locals.list();
    const remote = this.remotes.list();

    const files = await Promise.all([local, remote]);

    return files.flat();
  }

  info(descriptor: FileInfo): Awaitable<FileMeta | undefined> {
    return this.filesystem(descriptor).meta(descriptor.path);
  }

  private filesystem(descriptor: FileInfo): FileSearch {
    if (descriptor.type === FileType.Local) {
      return this.locals;
    }

    return this.remotes;
  }
}
