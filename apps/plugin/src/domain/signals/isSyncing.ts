import { createActionSignal } from "../../infrastructure/signals/createActionSignal.ts";

export const [sync, isSyncing] = createActionSignal(async () => {
  console.log("Synchronizing...");

  await sleep(50);

  console.log("Synchronized.");
});
