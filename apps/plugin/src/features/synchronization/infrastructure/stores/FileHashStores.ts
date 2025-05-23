import { container, resolve } from "@nimir/framework";
import { RemoteFileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/RemoteFileOperations.ts";
import { LocalFileOperations } from "@plugin/features/synchronization/infrastructure/LocalFileOperations.ts";
import { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";
import { SyncState } from "../SyncState.ts";

enum FileHashStoreType {
  Local = "local",
  Remote = "remote",
}

const provide = (type: FileHashStoreType, state = resolve(SyncState)) => {
  const filesystem = type === FileHashStoreType.Remote ? resolve(RemoteFileOperations) : resolve(LocalFileOperations);

  const key = type === FileHashStoreType.Remote ? "remoteFilesHashes" : "localFilesHashes";

  const store = FileHashStore.create(filesystem, state.get(key));

  store.subscribe(({ key: storeKey, value }) => {
    state.set(key, (previous) => previous.set(storeKey, value));
  });

  return store;
};

export const LocalFileHashStore = container.singleton({
  create: () => provide(FileHashStoreType.Local),
  name: "LocalFileHashStore",
});

export const RemoteFileHashStore = container.singleton({
  create: () => provide(FileHashStoreType.Remote),
  name: "RemoteFileHashStore",
});
