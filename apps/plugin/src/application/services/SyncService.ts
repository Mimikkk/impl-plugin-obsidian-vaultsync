import { EventService } from "@plugin/application/services/EventService.ts";
import { ClientState } from "@plugin/presentation/state/ClientState.ts";
import { FileChangeDetector } from "../../infrastructure/detectors/FileChangeDetector.ts";
import { ChangeService } from "./ChangeService.ts";

export namespace SyncService {
  const events = EventService;
  const changes = ChangeService;
  const detector = FileChangeDetector;

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
