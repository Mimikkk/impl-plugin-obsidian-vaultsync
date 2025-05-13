import { DateTimeNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import { LocalFileSystemClient } from "@plugin/infrastructure/clients/LocalFileSystemClient.ts";
import { RemoteFileSystemClient } from "@plugin/infrastructure/clients/RemoteFileSystemClient.ts";
import { FileHashSource } from "../sources/FileHashSource.ts";
import { FileHashStore } from "../stores/FileHashStore.ts";

export namespace FileComparator {
  const locals = LocalFileSystemClient;
  const remotes = RemoteFileSystemClient;

  const remoteHashStore = FileHashStore.create(FileHashSource.create(({ path }) => remotes.read(path)));
  const localHashStore = FileHashStore.create(FileHashSource.create(({ path }) => locals.read(path)));

  export async function compare(local: FileDescriptor, remote: FileDescriptor): Promise<boolean> {
    if (areTimestampsSimilar(local, remote)) return true;
    return await areHashesEqual(local, remote);
  }

  function areTimestampsSimilar(local: FileDescriptor, remote: FileDescriptor): boolean {
    return DateTimeNs.within(local.updatedAt, remote.updatedAt, 1000);
  }

  async function areHashesEqual(local: FileDescriptor, remote: FileDescriptor): Promise<boolean> {
    const [localHash, remoteHash] = await Promise.all([
      localHashStore.get(local),
      remoteHashStore.get(remote),
    ]);

    return localHash === remoteHash;
  }
}
