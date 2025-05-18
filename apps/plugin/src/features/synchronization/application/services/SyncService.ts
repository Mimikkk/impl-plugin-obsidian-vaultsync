import { EventService } from "@plugin/features/events/application/services/EventService.ts";
import { SyncManager } from "@plugin/features/synchronization/application/managers/SyncManager.ts";

export class SyncService {
  static create(
    events: EventService = EventService.create(),
    manager: SyncManager = SyncManager.create(),
  ) {
    return new SyncService(events, manager);
  }

  private constructor(
    private readonly events: EventService,
    private readonly manager: SyncManager,
  ) {}

  async synchronize() {
    console.log("Synchronizing...");

    await this.events.scan();
    await this.manager.synchronize();

    console.log("Synchronized.");
    return "OK";
  }
}
