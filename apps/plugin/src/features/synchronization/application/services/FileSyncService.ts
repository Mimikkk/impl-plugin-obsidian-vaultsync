import { resolve, singleton } from "@nimir/framework";
import { EventClient } from "@plugin/core/infrastructure/clients/EventClient";
import { FileSyncManager } from "@plugin/features/synchronization/application/managers/FileSyncManager.ts";
import { resolveConflicts } from "@plugin/features/synchronization/resolveConflicts";

@singleton
export class SyncService {
  static create(manager = resolve(FileSyncManager)) {
    return new SyncService(manager);
  }

  private constructor(private readonly manager: FileSyncManager) {}

  async synchronize() {
    await EventClient.scan.fetch({});
    const result = await this.manager.synchronize();

    if (result.conflicts.length > 0) {
      await resolveConflicts(result.conflicts);
    }
    return result;
  }
}
