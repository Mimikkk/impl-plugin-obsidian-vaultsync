import { DateTimeNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import { RemoteFileSystemClient } from "@plugin/core/infrastructure/clients/external/RemoteFileSystemClient.ts";
import { LocalFileSystemClient } from "@plugin/core/infrastructure/clients/internal/LocalFileSystemClient.ts";
import { StateProvider } from "../../../state/infrastructure/StateProvider.ts";
import { FileHashSource } from "../sources/FileHashSource.ts";
import { FileHashStore } from "../stores/FileHashStore.ts";

export class FileHashStoreWithState {
  static as(type: "remote" | "local") {
    const provider = StateProvider.instance;
    const state = provider.get();

    if (type === "remote") {
      const filesystem = RemoteFileSystemClient.create();

      const store = FileHashStore.create(
        FileHashSource.create(({ path }) => filesystem.read(path)),
        state.remoteHashes.get(),
      );

      store.subscribe(({ key, value }) => {
        state.remoteHashes.add(key, value);
      });

      return store;
    } else {
      const filesystem = LocalFileSystemClient.create();

      const store = FileHashStore.create(
        FileHashSource.create(({ path }) => filesystem.read(path)),
        state.localHashes.get(),
      );

      store.subscribe(({ key, value }) => {
        state.localHashes.add(key, value);
      });

      return store;
    }
  }
}

export class FileComparator {
  static create(
    locals: FileHashStore = FileHashStoreWithState.as("local"),
    remotes: FileHashStore = FileHashStoreWithState.as("remote"),
  ) {
    return new FileComparator(locals, remotes);
  }

  private constructor(
    private readonly locals: FileHashStore,
    private readonly remotes: FileHashStore,
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
      this.locals.get(local),
      this.remotes.get(remote),
    ]);

    return localHash === remoteHash;
  }
}
