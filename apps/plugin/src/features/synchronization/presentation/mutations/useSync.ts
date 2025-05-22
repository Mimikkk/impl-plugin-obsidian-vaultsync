import { di } from "@nimir/framework";
import { createUseMutation } from "@nimir/interaction";
import { lazy } from "@nimir/shared";
import { TSyncService } from "../../application/services/FileSyncService.ts";

const sync = lazy(() => di.of(TSyncService));
export const useSync = createUseMutation({ mutationKey: ["key"], mutationFn: () => sync().synchronize() });
