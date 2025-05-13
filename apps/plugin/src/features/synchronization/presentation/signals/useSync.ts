import { createUseMutation } from "@plugin/core/infrastructure/mutations/createUseMutation.ts";
import { SyncService } from "@plugin/features/synchronization/application/services/SyncService.ts";

export const useSync = createUseMutation({ mutationKey: ["key"], mutationFn: SyncService.sync });
