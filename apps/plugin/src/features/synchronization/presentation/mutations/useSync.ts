import { lazyResolve } from "@nimir/framework";
import { createUseMutation } from "@nimir/interaction";
import { SyncService } from "../../application/services/FileSyncService.ts";

const sync = lazyResolve(SyncService);
export const useSync = createUseMutation({ mutationKey: ["key"], mutationFn: () => sync().synchronize() });
