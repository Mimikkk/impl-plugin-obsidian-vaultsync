import { di } from "@nimir/framework";
import { type EventService, TEventService } from "@plugin/features/events/application/services/EventService.ts";
import {
  type FileSyncManager,
  TFileSyncManager,
} from "@plugin/features/synchronization/application/managers/FileSyncManager.ts";

export class SyncService {
  static create(
    events = di.of(TEventService),
    manager = di.of(TFileSyncManager),
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

export const TSyncService = di.singleton(SyncService);
