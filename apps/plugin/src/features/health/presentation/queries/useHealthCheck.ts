import { lazyResolve } from "@nimir/framework";
import { createUseQuery } from "@nimir/interaction";
import { TimeMs } from "@nimir/shared";
import { HealthService } from "@plugin/features/health/application/services/HealthService.ts";

const health = lazyResolve(HealthService);
export const useHealthCheck = createUseQuery({
  queryKey: ["health-check"],
  queryFn: () => health().check(),
  staleTime: TimeMs.m5,
  refetchInterval: TimeMs.m5,
  retry: 0,
});
