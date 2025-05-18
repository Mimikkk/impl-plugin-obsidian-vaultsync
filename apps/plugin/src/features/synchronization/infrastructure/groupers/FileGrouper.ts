import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import { LocalFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/LocalFilesystemProvider.ts";
import { RemoteFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/RemoteFilesystemProvider.ts";

export class FileGrouper {
  static create(
    locals: LocalFilesystemProvider = LocalFilesystemProvider.create(),
    remotes: RemoteFilesystemProvider = RemoteFilesystemProvider.create(),
  ) {
    return new FileGrouper(locals, remotes);
  }

  private constructor(
    private readonly locals: LocalFilesystemProvider,
    private readonly remotes: RemoteFilesystemProvider,
  ) {}

  async byLocation(): Promise<FileGrouperNs.LocationGroups> {
    const locals = await this.locals.list();
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

export namespace FileGrouperNs {
  export interface LocationGroups {
    both: { local: FileDescriptor; remote: FileDescriptor }[];
    localOnly: FileDescriptor[];
    remoteOnly: FileDescriptor[];
  }
}
