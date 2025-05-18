import { LocalFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/LocalFilesystemProvider.ts";
import { RemoteFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/RemoteFilesystemProvider.ts";
import { SyncStateProvider } from "@plugin/features/synchronization/infrastructure/providers/SyncStateProvider.ts";
import { FileHashSource } from "@plugin/features/synchronization/infrastructure/sources/FileHashSource.ts";
import { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";

enum FileHashStoreType {
  Local = "local",
  Remote = "remote",
}

export class FileHashStoreProvider {
  static create(
    state: SyncStateProvider = SyncStateProvider.create(),
  ) {
    return new FileHashStoreProvider(state);
  }

  private constructor(
    private readonly state: SyncStateProvider,
  ) {}

  local() {
    return this.type(FileHashStoreType.Local);
  }

  remote() {
    return this.type(FileHashStoreType.Remote);
  }

  type(type: FileHashStoreType) {
    const state = this.state.get();

    const filesystem = type === FileHashStoreType.Remote
      ? RemoteFilesystemProvider.create()
      : LocalFilesystemProvider.create();

    const store = FileHashStore.create(
      FileHashSource.create(({ path }) => filesystem.read(path)),
      state.remoteHashes.get(),
    );

    store.subscribe(({ key, value }) => {
      state.remoteHashes.add(key, value);
    });

    return store;
  }
}
