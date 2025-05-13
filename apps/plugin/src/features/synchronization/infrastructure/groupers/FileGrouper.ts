import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import { RemoteFileSystemClient } from "@plugin/core/infrastructure/clients/external/RemoteFileSystemClient.ts";
import { LocalFileSystemClient } from "@plugin/core/infrastructure/clients/internal/LocalFileSystemClient.ts";
export class FileGrouper {
  static create(
    locals: LocalFileSystemClient = LocalFileSystemClient.create(),
    remotes: RemoteFileSystemClient = RemoteFileSystemClient.create(),
  ) {
    return new FileGrouper(locals, remotes);
  }

  private constructor(
    private readonly locals: LocalFileSystemClient,
    private readonly remotes: RemoteFileSystemClient,
  ) {}

  async byLocation(): Promise<FileGrouper.LocationGroups> {
    const locals = this.locals.list();
    const remotes = await this.remotes.list();

    const both = [];
    const localOnly = [];
    const remoteOnly = [];

    for (const local of locals) {
      const remote = remotes.find((r) => r.path === local.path);

      if (remote) {
        both.push({ local, remote });
      } else {
        localOnly.push(local);
      }
    }

    for (const remote of remotes) {
      if (locals.some((l) => l.path === remote.path)) continue;
      remoteOnly.push(remote);
    }

    return { both, localOnly, remoteOnly };
  }
}

export namespace FileGrouper {
  export interface LocationGroups {
    both: { local: FileDescriptor; remote: FileDescriptor }[];
    localOnly: FileDescriptor[];
    remoteOnly: FileDescriptor[];
  }
}
