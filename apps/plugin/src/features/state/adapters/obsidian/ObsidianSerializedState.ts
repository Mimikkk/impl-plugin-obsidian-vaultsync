export interface ObsidianSerializedState {
  lastSyncTs: number | null;
  deleted: [string, number][];
  localHashes: [string, string][];
  remoteHashes: [string, string][];
}
