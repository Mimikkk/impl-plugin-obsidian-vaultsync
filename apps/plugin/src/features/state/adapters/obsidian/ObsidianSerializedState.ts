export interface ObsidianSerializedState {
  lastSyncTs: number | null;
  deletedFiles: [string, number][];
  localFilesHashes: [string, string][];
  remoteFilesHashes: [string, string][];
}
