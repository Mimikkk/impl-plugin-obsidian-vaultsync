import { createUseMutation } from "@nimir/interaction";
import { lazy } from "@nimir/shared";
import { SyncService } from "../../application/services/FileSyncService.ts";

const sync = lazy(SyncService.create);
export const useSync = createUseMutation({ mutationKey: ["key"], mutationFn: () => sync().synchronize() });
