import type { ObsidianState } from "./Serializer.ts";

export enum ValidationError {
  InvalidData = "invalid-data",
  InvalidLastSync = "invalid-last-sync",
  InvalidDeleted = "invalid-deleted",
  InvalidLocalHashes = "invalid-local-hashes",
  InvalidRemoteHashes = "invalid-remote-hashes",
}

export class ObsidianValidator {
  static create() {
    return new ObsidianValidator();
  }

  private constructor() {}

  isValid(data: unknown): data is ObsidianState {
    return this.validate(data) === data;
  }

  validate(data: unknown): ObsidianState | ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof data !== "object" || !data) {
      errors.push(ValidationError.InvalidData);
      return errors;
    }

    const { lastSyncTs, deleted, localHashes, remoteHashes } = data as ObsidianState;

    if (lastSyncTs && typeof lastSyncTs !== "number") errors.push(ValidationError.InvalidLastSync);
    if (deleted && !Array.isArray(deleted)) errors.push(ValidationError.InvalidDeleted);
    if (localHashes && !Array.isArray(localHashes)) errors.push(ValidationError.InvalidLocalHashes);
    if (remoteHashes && !Array.isArray(remoteHashes)) errors.push(ValidationError.InvalidRemoteHashes);

    return errors.length > 0 ? errors : data as ObsidianState;
  }
}
