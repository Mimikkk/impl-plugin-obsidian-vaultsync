import { MapState } from "../../../state/domain/MapState.ts";
import { ValueState } from "../../../state/domain/ValueState.ts";
import { type StateHandler } from "@plugin/features/state/infrastructure/StateRegistry.ts";

export interface SyncState {
  lastSyncTs: number | null;
  deleted: [string, number][];
  localHashes: [string, string][];
  remoteHashes: [string, string][];
}

export class SyncStateHandler implements StateHandler<SyncState> {
  static create() {
    return new SyncStateHandler(
      ValueState.create<number>(),
      MapState.create<string, number>(),
      MapState.create<string, string>(),
      MapState.create<string, string>(),
    );
  }

  private constructor(
    private readonly lastSync: ValueState<number>,
    private readonly deleted: MapState<string, number>,
    private readonly localHashes: MapState<string, string>,
    private readonly remoteHashes: MapState<string, string>,
  ) {}

  serialize(): SyncState {
    return {
      lastSyncTs: this.lastSync.get(),
      deleted: Array.from(this.deleted.get().entries()),
      localHashes: Array.from(this.localHashes.get().entries()),
      remoteHashes: Array.from(this.remoteHashes.get().entries()),
    };
  }

  deserialize(data: SyncState): void {
    this.lastSync.fromParameters(data.lastSyncTs);
    this.deleted.fromParameters(new Map(data.deleted));
    this.localHashes.fromParameters(new Map(data.localHashes));
    this.remoteHashes.fromParameters(new Map(data.remoteHashes));
  }

  getLastSync(): number | null {
    return this.lastSync.get();
  }

  setLastSync(ts: number): void {
    this.lastSync.set(ts);
  }

  getDeleted(): Map<string, number> {
    return this.deleted.get();
  }

  addDeleted(path: string, timestamp: number): void {
    this.deleted.add(path, timestamp);
  }

  clearDeleted(): void {
    this.deleted.clear();
  }

  getLocalHashes(): Map<string, string> {
    return this.localHashes.get();
  }

  addLocalHash(path: string, hash: string): void {
    this.localHashes.add(path, hash);
  }

  getRemoteHashes(): Map<string, string> {
    return this.remoteHashes.get();
  }

  addRemoteHash(path: string, hash: string): void {
    this.remoteHashes.add(path, hash);
  }
}
