import { DateTimeNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import { RemoteFileSystemClient } from "@plugin/core/infrastructure/clients/external/RemoteFileSystemClient.ts";
import { LocalFileSystemClient } from "@plugin/core/infrastructure/clients/internal/LocalFileSystemClient.ts";
import { StateProvider } from "../../../state/infrastructure/StateProvider.ts";
import { FileHashSource } from "../sources/FileHashSource.ts";
import { FileHashStore } from "../stores/FileHashStore.ts";

export class FileComparator {
  static create(
    locals: LocalFileSystemClient = LocalFileSystemClient.create(),
    remotes: RemoteFileSystemClient = RemoteFileSystemClient.create(),
    localHashStore: FileHashStore = FileHashStore.create(
      FileHashSource.create(({ path }) => locals.read(path)),
      StateProvider.instance.get().localHashes.get(),
    ),
    remoteHashStore: FileHashStore = FileHashStore.create(
      FileHashSource.create(({ path }) => remotes.read(path)),
      StateProvider.instance.get().remoteHashes.get(),
    ),
  ) {
    return new FileComparator(localHashStore, remoteHashStore);
  }

  private constructor(
    private readonly localHashStore: FileHashStore,
    private readonly remoteHashStore: FileHashStore,
  ) {}

  async compare(local: FileDescriptor, remote: FileDescriptor): Promise<boolean> {
    if (this.areTimestampsSimilar(local, remote)) return true;
    return await this.areHashesEqual(local, remote);
  }

  areTimestampsSimilar(local: FileDescriptor, remote: FileDescriptor): boolean {
    return DateTimeNs.within(local.updatedAt, remote.updatedAt, 1000);
  }

  async areHashesEqual(local: FileDescriptor, remote: FileDescriptor): Promise<boolean> {
    const [localHash, remoteHash] = await Promise.all([
      this.localHashStore.get(local),
      this.remoteHashStore.get(remote),
    ]);

    return localHash === remoteHash;
  }
}
