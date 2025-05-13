import { TimeMs } from "@nimir/shared";
import { SyncService } from "@plugin/application/services/SyncService.ts";
import { createUseQuery } from "@plugin/infrastructure/queries/createUseQuery.ts";

export const useHealthCheck = createUseQuery({
  queryKey: ["health-check"],
  queryFn: SyncService.health,
  staleTime: TimeMs.m5,
  refetchInterval: TimeMs.m5,
  retry: 0,
});
