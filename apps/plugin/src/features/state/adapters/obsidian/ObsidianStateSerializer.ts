import { State } from "@plugin/features/state/domain/entities/State.ts";
import { StateValueItem } from "../../domain/valueobjects/StateValueItem.ts";
import { StateValueMap } from "../../domain/valueobjects/StateValueMap.ts";
import type { ObsidianSerializedState } from "./ObsidianSerializedState.ts";

export class ObsidianStateSerializer {
  static create() {
    return new ObsidianStateSerializer();
  }

  private constructor() {}

  serialize(state: State): ObsidianSerializedState {
    return {
      lastSyncTs: state.lastSync.get(),
      deleted: Array.from(state.deletedFiles.get().entries()),
      localHashes: Array.from(state.localFilesHashes.get().entries()),
      remoteHashes: Array.from(state.remoteFilesHashes.get().entries()),
    };
  }

  deserialize(data: ObsidianSerializedState): State {
    return State.create(
      StateValueItem.fromParameters(data.lastSyncTs),
      StateValueMap.fromParameters(new Map(data.deleted)),
      StateValueMap.fromParameters(new Map(data.localHashes)),
      StateValueMap.fromParameters(new Map(data.remoteHashes)),
    );
  }
}
