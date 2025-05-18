import { lazy } from "@nimir/shared";
import { createUseMutation } from "@plugin/core/infrastructure/mutations/createUseMutation.ts";
import { SyncService } from "../../application/services/FileSyncService.ts";

const sync = lazy(SyncService.create);
export const useSync = createUseMutation({ mutationKey: ["key"], mutationFn: () => sync().synchronize() });
