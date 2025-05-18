import type { ObsidianSerializedState } from "./ObsidianSerializedState.ts";

export enum ObsidianStateValidationError {
  InvalidData = "invalid-data",
  InvalidLastSync = "invalid-last-sync",
  InvalidDeleted = "invalid-deleted-files",
  InvalidLocalHashes = "invalid-local-files-hashes",
  InvalidRemoteHashes = "invalid-remote-files-hashes",
}

export class ObsidianStateValidator {
  static create() {
    return new ObsidianStateValidator();
  }

  private constructor() {}

  isValid(data: unknown): data is ObsidianSerializedState {
    return this.validate(data) === data;
  }

  validate(data: unknown): ObsidianSerializedState | ObsidianStateValidationError[] {
    const errors: ObsidianStateValidationError[] = [];

    if (typeof data !== "object" || !data) {
      errors.push(ObsidianStateValidationError.InvalidData);
      return errors;
    }

    const { lastSyncTs, deletedFiles, localFilesHashes, remoteFilesHashes } = data as ObsidianSerializedState;

    if (lastSyncTs && typeof lastSyncTs !== "number") {
      errors.push(ObsidianStateValidationError.InvalidLastSync);
    }

    if (deletedFiles && !Array.isArray(deletedFiles)) {
      errors.push(ObsidianStateValidationError.InvalidDeleted);
    }

    if (localFilesHashes && !Array.isArray(localFilesHashes)) {
      errors.push(ObsidianStateValidationError.InvalidLocalHashes);
    }

    if (remoteFilesHashes && !Array.isArray(remoteFilesHashes)) {
      errors.push(ObsidianStateValidationError.InvalidRemoteHashes);
    }

    return errors.length > 0 ? errors : data as ObsidianSerializedState;
  }
}
