import { StateValueItem } from "../valueobjects/StateValueItem.ts";
import { StateValueMap } from "../valueobjects/StateValueMap.ts";

export class State {
  static create(
    lastSync: StateValueItem<number> = StateValueItem.create(),
    deleted: StateValueMap<string, number> = StateValueMap.create(),
    localHashes: StateValueMap<string, string> = StateValueMap.create(),
    remoteHashes: StateValueMap<string, string> = StateValueMap.create(),
  ) {
    return new State(lastSync, deleted, localHashes, remoteHashes);
  }

  private constructor(
    public readonly lastSync: StateValueItem<number>,
    public readonly deletedFiles: StateValueMap<string, number>,
    public readonly localFilesHashes: StateValueMap<string, string>,
    public readonly remoteFilesHashes: StateValueMap<string, string>,
  ) {}

  from(state: State): this {
    this.lastSync.from(state.lastSync);
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
    this.lastSync.fromParameters(lastSync);
    this.deletedFiles.fromParameters(deleted);
    this.localFilesHashes.fromParameters(localHashes);
    this.remoteFilesHashes.fromParameters(remoteHashes);
    return this;
  }
}
