import { TimeMs } from "@nimir/shared";
import { createUseQuery } from "@plugin/core/infrastructure/queries/createUseQuery.ts";
import { SyncService } from "@plugin/features/synchronization/application/services/SyncService.ts";

export const useHealthCheck = createUseQuery({
  queryKey: ["health-check"],
  queryFn: () => SyncService.create().health(),
  staleTime: TimeMs.m5,
  refetchInterval: TimeMs.m5,
  retry: 0,
});
