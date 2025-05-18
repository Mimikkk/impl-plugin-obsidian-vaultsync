import type { ObsidianSerializedState } from "./ObsidianSerializedState.ts";

export enum ObsidianStateValidationError {
  InvalidData = "invalid-data",
  InvalidLastSync = "invalid-last-sync",
  InvalidDeleted = "invalid-deleted",
  InvalidLocalHashes = "invalid-local-hashes",
  InvalidRemoteHashes = "invalid-remote-hashes",
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

    const { lastSyncTs, deleted, localHashes, remoteHashes } = data as ObsidianSerializedState;

    if (lastSyncTs && typeof lastSyncTs !== "number") errors.push(ObsidianStateValidationError.InvalidLastSync);
    if (deleted && !Array.isArray(deleted)) errors.push(ObsidianStateValidationError.InvalidDeleted);
    if (localHashes && !Array.isArray(localHashes)) errors.push(ObsidianStateValidationError.InvalidLocalHashes);
    if (remoteHashes && !Array.isArray(remoteHashes)) errors.push(ObsidianStateValidationError.InvalidRemoteHashes);

    return errors.length > 0 ? errors : data as ObsidianSerializedState;
  }
}
