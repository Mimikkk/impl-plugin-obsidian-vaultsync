import { EventService } from "@plugin/features/events/application/services/EventService.ts";
import { FileSyncManager } from "@plugin/features/synchronization/application/managers/FileSyncManager.ts";

export class SyncService {
  static create(
    events: EventService = EventService.create(),
    manager: FileSyncManager = FileSyncManager.create(),
  ) {
    return new SyncService(events, manager);
  }

  private constructor(
    private readonly events: EventService,
    private readonly manager: FileSyncManager,
  ) {}

  async synchronize() {
    console.log("Synchronizing...");

    await this.events.scan();
    const changes = await this.manager.synchronize();

    console.log("Synchronized.", changes);

    return "OK";
  }
}
