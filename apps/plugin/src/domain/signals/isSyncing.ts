import { SyncthingService } from "@plugin/application/services/SyncthingService.ts";
import { createActionSignal } from "../../infrastructure/signals/createActionSignal.ts";

export const [sync, isSyncing] = createActionSignal(async () => {
  console.log("Synchronizing...");

  const devices = await SyncthingService.getDevices();
  console.log({ devices });

  await sleep(50);

  console.log("Synchronized.");
});
