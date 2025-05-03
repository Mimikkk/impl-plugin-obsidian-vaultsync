import { SyncService } from "@plugin/application/services/SyncService.ts";
import { createActionSignal } from "../../infrastructure/signals/createActionSignal.ts";

export const [sync, isSyncing] = createActionSignal(async () => {
  console.log("Synchronizing...");

  const devices = await SyncService.folders();
  console.log({ devices });

  await sleep(50);

  console.log("Synchronized.");
});
