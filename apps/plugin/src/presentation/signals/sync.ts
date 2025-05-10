import { SyncService } from "@plugin/application/services/SyncService.ts";
import { createActionSignal } from "./primitives/createActionSignal.ts";

export const [sync, isSyncing] = createActionSignal(SyncService.sync);
