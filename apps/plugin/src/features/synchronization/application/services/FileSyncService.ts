import { resolve, singleton } from "@nimir/framework";
import { EventService } from "@plugin/features/events/application/services/EventService.ts";
import { FileSyncManager } from "@plugin/features/synchronization/application/managers/FileSyncManager.ts";

@singleton
export class SyncService {
  static create(
    events = resolve(EventService),
    manager = resolve(FileSyncManager),
  ) {
    return new SyncService(events, manager);
  }

  private constructor(
    private readonly events: EventService,
    private readonly manager: FileSyncManager,
  ) {}

  async synchronize() {
    await this.events.scan();
    const changes = await this.manager.synchronize();

    console.log("changes:", changes);

    return changes;
  }
}
