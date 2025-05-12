import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import { LocalFileSystemClient } from "../../infrastructure/clients/LocalFileSystemClient.ts";
import { RemoteFileSystemClient } from "../../infrastructure/clients/RemoteFileSystemClient.ts";
import { HashService } from "./HashService.ts";

export namespace FileService {
  const locals = LocalFileSystemClient;
  const remotes = RemoteFileSystemClient;
  const hashes = HashService;

  export interface LocationGroups {
    both: { local: FileDescriptor; remote: FileDescriptor }[];
    localOnly: FileDescriptor[];
    remoteOnly: FileDescriptor[];
  }

  export async function areFilesEqual(local: FileDescriptor, remote: FileDescriptor): Promise<boolean> {
    const [localBuffer, remoteBuffer] = await Promise.all([
      locals.read(local.path),
      remotes.read(remote.path),
    ]);

    return await hashes.isHashEqual(localBuffer!, remoteBuffer!);
  }

  export async function byLocation(): Promise<LocationGroups> {
    const locals = await LocalFileSystemClient.list();
    const remotes = await RemoteFileSystemClient.list();

    const both = [];
    const localOnly = [];
    const remoteOnly = [];

    for (const descriptor of locals) {
      const remote = remotes.find((r) => r.path === descriptor.path);

      if (remote) {
        both.push({ local: descriptor, remote: remote });
      } else {
        localOnly.push(descriptor);
      }
    }

    for (const descriptor of remotes) {
      if (!locals.some((l) => l.path === descriptor.path)) continue;
      remoteOnly.push(descriptor);
    }

    return { both, localOnly, remoteOnly };
  }
}
