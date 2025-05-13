import { SyncHealthClient } from "@plugin/core/infrastructure/clients/external/SyncHealthClient.ts";
import { ClientState } from "@plugin/features/interface/presentation/state/ClientState.ts";
import { EventService } from "@plugin/features/synchronization/application/services/EventService.ts";
import { FileChangeDetector } from "@plugin/features/synchronization/infrastructure/detectors/FileChangeDetector.ts";
import { ChangeService } from "./ChangeService.ts";

export namespace SyncService {
  const events = EventService;
  const changes = ChangeService;
  const detector = FileChangeDetector;

  export async function health() {
    return await SyncHealthClient.check();
  }

  export async function sync() {
    console.log("Synchronizing...");

    await events.scan();

    const detected = await detector.detect();

    await changes.updates(detected);

    ClientState.deleted.clear();
    ClientState.lastSync.now();
    ClientState.save();

    console.log("Synchronized.");
    return "OK";
  }
}
