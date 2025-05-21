import { LocalFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/LocalFilesystemProvider.ts";
import { RemoteFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/RemoteFilesystemProvider.ts";
import { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";
import { type ISyncState, SyncState } from "../SyncState.ts";

enum FileHashStoreType {
  Local = "local",
  Remote = "remote",
}

export class FileHashStoreProvider {
  static create(
    state: ISyncState = SyncState,
  ) {
    return new FileHashStoreProvider(state);
  }

  private constructor(
    private readonly state: ISyncState,
  ) {}

  static local() {
    return this.create().local();
  }

  static remote() {
    return this.create().remote();
  }

  local() {
    return this.type(FileHashStoreType.Local);
  }

  remote() {
    return this.type(FileHashStoreType.Remote);
  }

  type(type: FileHashStoreType) {
    const filesystem = type === FileHashStoreType.Remote
      ? RemoteFilesystemProvider.create()
      : LocalFilesystemProvider.create();

    const key = type === FileHashStoreType.Remote ? "remoteFilesHashes" : "localFilesHashes";

    const store = FileHashStore.create(
      filesystem,
      this.state.get(key),
    );

    store.subscribe(({ key: storeKey, value }) => {
      this.state.set(key, (previous) => previous.set(storeKey, value));
    });

    return store;
  }
}
