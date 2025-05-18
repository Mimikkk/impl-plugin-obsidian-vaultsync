import { SyncState } from "@plugin/features/state/domain/entities/SyncState.ts";
import { StateValueItem } from "../../domain/valueobjects/StateValueItem.ts";
import { StateValueMap } from "../../domain/valueobjects/StateValueMap.ts";
import type { ObsidianSerializedState } from "./ObsidianSerializedState.ts";

export class ObsidianStateSerializer {
  static create() {
    return new ObsidianStateSerializer();
  }

  private constructor() {}

  serialize(state: SyncState): ObsidianSerializedState {
    return {
      lastSyncTs: state.lastSyncTs.get(),
      deletedFiles: Array.from(state.deletedFiles.get().entries()),
      localFilesHashes: Array.from(state.localFilesHashes.get().entries()),
      remoteFilesHashes: Array.from(state.remoteFilesHashes.get().entries()),
    };
  }

  deserialize(data: ObsidianSerializedState): SyncState {
    return SyncState.create(
      StateValueItem.fromParameters(data.lastSyncTs),
      StateValueMap.fromParameters(new Map(data.deletedFiles)),
      StateValueMap.fromParameters(new Map(data.localFilesHashes)),
      StateValueMap.fromParameters(new Map(data.remoteFilesHashes)),
    );
  }
}
