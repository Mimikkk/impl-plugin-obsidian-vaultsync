import { SyncService } from "@plugin/application/services/SyncService.ts";
import { createActionSignal } from "../../infrastructure/signals/createActionSignal.ts";

export const [sync, isSyncing] = createActionSignal(SyncService.sync);
