import { StateProvider } from "@plugin/features/state/infrastructure/StateProvider.ts";
import type { FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import { FileChangeDetector } from "@plugin/features/synchronization/infrastructure/detectors/FileChangeDetector.ts";
import { FileChangeManager } from "./FileChangeManager.ts";

export class SyncManager {
  static create(
    changes: FileChangeManager = FileChangeManager.create(),
    detector: FileChangeDetector = FileChangeDetector.create(),
    state: StateProvider = StateProvider.instance,
  ) {
    return new SyncManager(changes, detector, state);
  }

  private constructor(
    private readonly changes: FileChangeManager,
    private readonly detector: FileChangeDetector,
    private readonly state: StateProvider,
  ) {}

  async synchronize(): Promise<FileChange[]> {
    const changes = await this.detector.detect();

    await this.changes.updates(changes);

    await this.state.update((state) => {
      state.deleted.clear();
      state.lastSync.set(Date.now());
    });

    return changes;
  }
}
