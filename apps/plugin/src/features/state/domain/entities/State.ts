import { MapState } from "../valueobjects/MapState.ts";
import { ValueState } from "../valueobjects/ValueState.ts";

export class State {
  static create(
    lastSync: ValueState<number> = ValueState.create(),
    deleted: MapState<string, number> = MapState.create(),
    localHashes: MapState<string, string> = MapState.create(),
    remoteHashes: MapState<string, string> = MapState.create(),
  ) {
    return new State(lastSync, deleted, localHashes, remoteHashes);
  }

  private constructor(
    public readonly lastSync: ValueState<number>,
    public readonly deleted: MapState<string, number>,
    public readonly localHashes: MapState<string, string>,
    public readonly remoteHashes: MapState<string, string>,
  ) {}

  from(state: State): this {
    this.lastSync.from(state.lastSync);
    this.deleted.from(state.deleted);
    this.localHashes.from(state.localHashes);
    this.remoteHashes.from(state.remoteHashes);
    return this;
  }

  fromParameters(
    lastSync: number | null,
    deleted: Map<string, number>,
    localHashes: Map<string, string>,
    remoteHashes: Map<string, string>,
  ): this {
    this.lastSync.fromParameters(lastSync);
    this.deleted.fromParameters(deleted);
    this.localHashes.fromParameters(localHashes);
    this.remoteHashes.fromParameters(remoteHashes);
    return this;
  }
}
