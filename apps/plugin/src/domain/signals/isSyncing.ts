import { createActionSignal } from "../../infrastructure/signals/createActionSignal.ts";

export const [sync, isSyncing] = createActionSignal(async () => {
  console.log("Synchronizing...");

  const files = app.vault.getFiles();

  await sleep(2000);

  console.log("Synchronized.");
});
