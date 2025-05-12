import { EventService } from "@plugin/application/services/EventService.ts";
import { FileChangeDetector } from "../../infrastructure/detectors/FileChangeDetector.ts";
import { ChangeService } from "./ChangeService.ts";

export namespace SyncService {
  const events = EventService;
  const changes = ChangeService;
  const detector = FileChangeDetector;

  export async function sync() {
    console.log("Synchronizing...");

    await events.scan();

    const commands = await detector.detect();

    await changes.updates(commands);

    console.log("Synchronized.");
    return "OK";
  }
}
