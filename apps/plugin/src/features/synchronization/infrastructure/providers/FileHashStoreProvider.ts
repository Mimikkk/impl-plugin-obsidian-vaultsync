import { di } from "@nimir/framework";
import { TLocalFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/LocalFilesystemProvider.ts";
import { TRemoteFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/RemoteFilesystemProvider.ts";
import { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";
import { TSyncState } from "../SyncState.ts";

enum FileHashStoreType {
  Local = "local",
  Remote = "remote",
}

const create = (type: FileHashStoreType, state = di.of(TSyncState)) => {
  const filesystem = type === FileHashStoreType.Remote
    ? di.of(TRemoteFilesystemProvider)
    : di.of(TLocalFilesystemProvider);

  const key = type === FileHashStoreType.Remote ? "remoteFilesHashes" : "localFilesHashes";

  const store = FileHashStore.create(filesystem, state.get(key));

  store.subscribe(({ key: storeKey, value }) => {
    state.set(key, (previous) => previous.set(storeKey, value));
  });

  return store;
};

export const TLocalFileHashProvider = di.singleton({
  create: () => create(FileHashStoreType.Local),
});

export const TRemoteFileHashProvider = di.singleton({
  create: () => create(FileHashStoreType.Remote),
});
