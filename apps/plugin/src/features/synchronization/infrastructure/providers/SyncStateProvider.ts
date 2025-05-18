import { MapState } from "@plugin/features/state/domain/valueobjects/MapState.ts";
import { ValueState } from "@plugin/features/state/domain/valueobjects/ValueState.ts";
import type { ManagerUpdate } from "@plugin/features/state/infrastructure/Manager.ts";
import { StateProvider } from "@plugin/features/state/infrastructure/StateProvider.ts";

export class SyncState {
  static create(
    lastSync: ValueState<number> = ValueState.create(),
    deleted: MapState<string, number> = MapState.create(),
    localHashes: MapState<string, string> = MapState.create(),
    remoteHashes: MapState<string, string> = MapState.create(),
  ) {
    return new SyncState(lastSync, deleted, localHashes, remoteHashes);
  }

  private constructor(
    public readonly lastSync: ValueState<number>,
    public readonly deleted: MapState<string, number>,
    public readonly localHashes: MapState<string, string>,
    public readonly remoteHashes: MapState<string, string>,
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

  public async update(callback: ManagerUpdate): Promise<void> {
    await this.state.update(callback);
  }

  public get(): SyncState {
    const raw = this.state.get();

    return SyncState.create(
      raw.lastSync,
      raw.deleted,
      raw.localHashes,
      raw.remoteHashes,
    );
  }
}
