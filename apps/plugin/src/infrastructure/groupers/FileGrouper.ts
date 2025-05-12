import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import { LocalFileSystemClient } from "@plugin/infrastructure/clients/LocalFileSystemClient.ts";
import { RemoteFileSystemClient } from "@plugin/infrastructure/clients/RemoteFileSystemClient.ts";

export namespace FileGrouper {
  export interface LocationGroups {
    both: { local: FileDescriptor; remote: FileDescriptor }[];
    localOnly: FileDescriptor[];
    remoteOnly: FileDescriptor[];
  }

  export async function byLocation(): Promise<LocationGroups> {
    const locals = await LocalFileSystemClient.list();
    const remotes = await RemoteFileSystemClient.list();

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
