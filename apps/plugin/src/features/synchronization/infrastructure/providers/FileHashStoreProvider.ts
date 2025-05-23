import { container, resolve } from "@nimir/framework";
import { LocalFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/LocalFilesystemProvider.ts";
import { RemoteFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/RemoteFilesystemProvider.ts";
import { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";
import { SyncState } from "../SyncState.ts";

enum FileHashStoreType {
  Local = "local",
  Remote = "remote",
}

const create = (type: FileHashStoreType, state = resolve(SyncState)) => {
  const filesystem = type === FileHashStoreType.Remote
    ? resolve(RemoteFilesystemProvider)
    : resolve(LocalFilesystemProvider);

  const key = type === FileHashStoreType.Remote ? "remoteFilesHashes" : "localFilesHashes";

  const store = FileHashStore.create(filesystem, state.get(key));

  store.subscribe(({ key: storeKey, value }) => {
    state.set(key, (previous) => previous.set(storeKey, value));
  });

  return store;
};

export const LocalFileHashProvider = container.singleton({
  create: () => create(FileHashStoreType.Local),
  name: "LocalFileHashProvider",
});

export const RemoteFileHashProvider = container.singleton({
  create: () => create(FileHashStoreType.Remote),
  name: "RemoteFileHashProvider",
});
