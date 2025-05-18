import { StateProvider } from "@plugin/features/state/infrastructure/StateProvider.ts";
import { FileChangeDetector } from "@plugin/features/synchronization/infrastructure/detectors/FileChangeDetector.ts";
import { EventService } from "../../../events/application/services/EventService.ts";
import { ChangeService } from "./ChangeService.ts";

export class SyncService {
  static create(
    events: EventService = EventService.create(),
    changes: ChangeService = ChangeService.create(),
    detector: FileChangeDetector = FileChangeDetector.create(),
  ) {
    return new SyncService(events, changes, detector);
  }

  private constructor(
    private readonly events: EventService,
    private readonly changes: ChangeService,
    private readonly detector: FileChangeDetector,
  ) {}

  async synchronize() {
    console.log("Synchronizing...");

    await this.events.scan();

    const detected = await this.detector.detect();

    await this.changes.updates(detected);

    StateProvider.instance.update((state) => {
      state.deleted.clear();
      state.lastSync.set(Date.now());
    });

    console.log("Synchronized.");
    return "OK";
  }
}
