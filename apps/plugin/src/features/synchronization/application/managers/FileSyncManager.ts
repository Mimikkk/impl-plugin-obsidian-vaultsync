import { resolve, singleton } from "@nimir/framework";
import type { FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import { ChangeType } from "@plugin/features/synchronization/domain/FileChange.ts";
import { FileChangeDetector } from "@plugin/features/synchronization/infrastructure/detectors/FileChangeDetector.ts";
import { type ISyncState, SyncState } from "../../infrastructure/SyncState.ts";
import { FileChangeManager } from "./FileChangeManager.ts";

export interface SyncResult {
  applied: FileChange[];
  conflicts: FileChange[];
}

@singleton
export class FileSyncManager {
  static create(
    changes = resolve(FileChangeManager),
    detector = resolve(FileChangeDetector),
    state = resolve(SyncState),
  ) {
    return new FileSyncManager(changes, detector, state);
  }

  private constructor(
    private readonly changes: FileChangeManager,
    private readonly detector: FileChangeDetector,
    private readonly state: ISyncState,
  ) {}

  async synchronize(): Promise<SyncResult> {
    const detected = await this.detector.detect();
    const conflicts = detected.filter((change) => change.type === ChangeType.Conflict);
    const applied = detected.filter((change) => change.type !== ChangeType.Conflict);

    await this.changes.updates(applied);
    this.state.update({ lastSyncTs: Date.now() });

    return { applied, conflicts };
  }
}
