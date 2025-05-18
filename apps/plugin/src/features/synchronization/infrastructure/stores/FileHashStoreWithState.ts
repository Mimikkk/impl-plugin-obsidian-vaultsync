import { RemoteFileSystemClient } from "@plugin/core/infrastructure/clients/external/RemoteFileSystemClient.ts";
import { LocalFileSystemClient } from "@plugin/core/infrastructure/clients/internal/LocalFileSystemClient.ts";
import { StateProvider } from "@plugin/features/state/infrastructure/StateProvider.ts";
import { FileHashSource } from "@plugin/features/synchronization/infrastructure/sources/FileHashSource.ts";
import { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";

enum FileHashStoreType {
  Local = "local",
  Remote = "remote",
}

export class FileHashStoreWithState {
  static local() {
    return FileHashStoreWithState.type(FileHashStoreType.Local);
  }

  static remote() {
    return FileHashStoreWithState.type(FileHashStoreType.Remote);
  }

  static type(type: FileHashStoreType) {
    const provider = StateProvider.instance;
    const state = provider.get();
    const filesystem = type === FileHashStoreType.Remote
      ? RemoteFileSystemClient.create()
      : LocalFileSystemClient.create();

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
