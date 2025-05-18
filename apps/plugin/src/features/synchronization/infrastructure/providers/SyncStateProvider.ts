import { StateProvider } from "../../../state/infrastructure/SyncStateProvider.ts";
import { StateValueItem } from "../../../state/domain/valueobjects/StateValueItem.ts";
import { StateValueMap } from "../../../state/domain/valueobjects/StateValueMap.ts";
import type { StateManagerUpdate } from "../../../state/infrastructure/SyncStateManager.ts";

export class SyncState {
  static create(
    lastSync: StateValueItem<number> = StateValueItem.create(),
    deleted: StateValueMap<string, number> = StateValueMap.create(),
    localHashes: StateValueMap<string, string> = StateValueMap.create(),
    remoteHashes: StateValueMap<string, string> = StateValueMap.create(),
  ) {
    return new SyncState(lastSync, deleted, localHashes, remoteHashes);
  }

  private constructor(
    public readonly lastSync: StateValueItem<number>,
    public readonly deleted: StateValueMap<string, number>,
    public readonly localHashes: StateValueMap<string, string>,
    public readonly remoteHashes: StateValueMap<string, string>,
  ) {}
}

export class SyncStateProvider {
  static create(
    state: StateProvider = StateProvider.instance,
  ) {
    return new SyncStateProvider(state);
  }

  private constructor(
    readonly state: StateProvider,
  ) {}

  public async update(callback: StateManagerUpdate): Promise<void> {
    await this.state.update(callback);
  }

  public get(): SyncState {
    const raw = this.state.get();

    return SyncState.create(
      raw.lastSyncTs,
      raw.deletedFiles,
      raw.localFilesHashes,
      raw.remoteFilesHashes,
    );
  }
}
