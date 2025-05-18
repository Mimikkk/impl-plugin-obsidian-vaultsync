import { StateValueItem } from "../valueobjects/StateValueItem.ts";
import { StateValueMap } from "../valueobjects/StateValueMap.ts";

export class SyncState {
  static create(
    lastSyncTs: StateValueItem<number> = StateValueItem.create(),
    deletedFiles: StateValueMap<string, number> = StateValueMap.create(),
    localFilesHashes: StateValueMap<string, string> = StateValueMap.create(),
    remoteFilesHashes: StateValueMap<string, string> = StateValueMap.create(),
  ) {
    return new SyncState(lastSyncTs, deletedFiles, localFilesHashes, remoteFilesHashes);
  }

  private constructor(
    public readonly lastSyncTs: StateValueItem<number>,
    public readonly deletedFiles: StateValueMap<string, number>,
    public readonly localFilesHashes: StateValueMap<string, string>,
    public readonly remoteFilesHashes: StateValueMap<string, string>,
  ) {}

  from(state: SyncState): this {
    this.lastSyncTs.from(state.lastSyncTs);
    this.deletedFiles.from(state.deletedFiles);
    this.localFilesHashes.from(state.localFilesHashes);
    this.remoteFilesHashes.from(state.remoteFilesHashes);
    return this;
  }

  fromParameters(
    lastSync: number | null,
    deleted: Map<string, number>,
    localHashes: Map<string, string>,
    remoteHashes: Map<string, string>,
  ): this {
    this.lastSyncTs.fromParameters(lastSync);
    this.deletedFiles.fromParameters(deleted);
    this.localFilesHashes.fromParameters(localHashes);
    this.remoteFilesHashes.fromParameters(remoteHashes);
    return this;
  }
}
