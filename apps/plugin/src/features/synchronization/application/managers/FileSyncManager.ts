import { di } from "@nimir/framework";
import type { FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import {
  type FileChangeDetector,
  TFileChangeDetector,
} from "@plugin/features/synchronization/infrastructure/detectors/FileChangeDetector.ts";
import { type ISyncState, TSyncState } from "../../infrastructure/SyncState.ts";
import { type FileChangeManager, TFileChangeManager } from "./FileChangeManager.ts";

export class FileSyncManager {
  static create(
    changes = di.of(TFileChangeManager),
    detector = di.of(TFileChangeDetector),
    state = di.of(TSyncState),
  ) {
    return new FileSyncManager(changes, detector, state);
  }

  private constructor(
    private readonly changes: FileChangeManager,
    private readonly detector: FileChangeDetector,
    private readonly state: ISyncState,
  ) {}

  async synchronize(): Promise<FileChange[]> {
    const changes = await this.detector.detect();

    await this.changes.updates(changes);

    this.state.update({
      deletedFiles(previous) {
        previous.clear();
        return previous;
      },
      lastSyncTs: Date.now(),
    });

    return changes;
  }
}

export const TFileSyncManager = di.singleton(FileSyncManager);
