import { SyncService } from "@plugin/application/services/SyncService.ts";
import { createUseMutation } from "../../infrastructure/mutations/createUseMutation.ts";

export const useSync = createUseMutation({ mutationKey: ["key"], mutationFn: SyncService.sync });
