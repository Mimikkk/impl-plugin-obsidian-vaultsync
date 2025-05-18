import { lazy } from "@nimir/shared";
import { createUseMutation } from "@plugin/core/infrastructure/mutations/createUseMutation.ts";
import { SyncService } from "@plugin/features/synchronization/application/services/SyncService.ts";

const sync = lazy(SyncService.create);
export const useSync = createUseMutation({ mutationKey: ["key"], mutationFn: () => sync().synchronize() });
