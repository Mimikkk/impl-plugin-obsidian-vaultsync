import { State } from "@plugin/features/state/domain/entities/State.ts";
import { MapState } from "@plugin/features/state/domain/valueobjects/MapState.ts";
import { ValueState } from "@plugin/features/state/domain/valueobjects/ValueState.ts";

export interface ObsidianState {
  lastSyncTs: number | null;
  deleted: [string, number][];
  localHashes: [string, string][];
  remoteHashes: [string, string][];
}

export class ObsidianSerializer {
  static create() {
    return new ObsidianSerializer();
  }

  private constructor() {}

  serialize(state: State): ObsidianState {
    return {
      lastSyncTs: state.lastSync.get(),
      deleted: Array.from(state.deleted.get().entries()),
      localHashes: Array.from(state.localHashes.get().entries()),
      remoteHashes: Array.from(state.remoteHashes.get().entries()),
    };
  }

  deserialize(data: ObsidianState): State {
    return State.create(
      ValueState.fromParameters(data.lastSyncTs),
      MapState.fromParameters(new Map(data.deleted)),
      MapState.fromParameters(new Map(data.localHashes)),
      MapState.fromParameters(new Map(data.remoteHashes)),
    );
  }
}
