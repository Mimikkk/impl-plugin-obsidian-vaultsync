import { StateProvider } from "../../../state/infrastructure/SyncStateProvider.ts";
import type { FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import { FileChangeDetector } from "@plugin/features/synchronization/infrastructure/detectors/FileChangeDetector.ts";
import { FileChangeManager } from "@plugin/features/synchronization/application/managers/FileChangeManager.ts";

export class SyncManager {
  static create(
    files: FileChangeManager = FileChangeManager.create(),
    detector: FileChangeDetector = FileChangeDetector.create(),
    state: StateProvider = StateProvider.instance,
  ) {
    return new SyncManager(files, detector, state);
  }

  private constructor(
    private readonly files: FileChangeManager,
    private readonly detector: FileChangeDetector,
    private readonly state: StateProvider,
  ) {}

  async synchronize(): Promise<FileChange[]> {
    const changes = await this.detector.detect();

    await this.files.updates(changes);

    await this.state.update((state) => {
      state.deletedFiles.clear();
      state.lastSyncTs.set(Date.now());
    });

    return changes;
  }
}
