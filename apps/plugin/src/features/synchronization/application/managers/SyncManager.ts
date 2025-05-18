import { StateProvider } from "@plugin/features/state/infrastructure/StateProvider.ts";
import type { FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import { FileChangeDetector } from "@plugin/features/synchronization/infrastructure/detectors/FileChangeDetector.ts";
import { ChangeManager } from "./ChangeManager.ts";

export class SyncManager {
  static create(
    files: ChangeManager = ChangeManager.create(),
    detector: FileChangeDetector = FileChangeDetector.create(),
    state: StateProvider = StateProvider.instance,
  ) {
    return new SyncManager(files, detector, state);
  }

  private constructor(
    private readonly files: ChangeManager,
    private readonly detector: FileChangeDetector,
    private readonly state: StateProvider,
  ) {}

  async synchronize(): Promise<FileChange[]> {
    const changes = await this.detector.detect();

    await this.files.updates(changes);

    await this.state.update((state) => {
      state.deleted.clear();
      state.lastSync.set(Date.now());
    });

    return changes;
  }
}
