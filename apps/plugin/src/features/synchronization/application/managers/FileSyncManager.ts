import { resolve, singleton } from "@nimir/framework";
import type { FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import { FileChangeDetector } from "@plugin/features/synchronization/infrastructure/detectors/FileChangeDetector.ts";
import { type ISyncState, SyncState } from "../../infrastructure/SyncState.ts";
import { FileChangeManager } from "./FileChangeManager.ts";

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
