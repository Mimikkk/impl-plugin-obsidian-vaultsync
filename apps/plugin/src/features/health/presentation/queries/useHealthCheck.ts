import { di } from "@nimir/framework";
import { createUseQuery } from "@nimir/interaction";
import { lazy, TimeMs } from "@nimir/shared";
import { THealthService } from "@plugin/features/health/application/services/HealthService.ts";

const health = lazy(() => di.of(THealthService));
export const useHealthCheck = createUseQuery({
  queryKey: ["health-check"],
  queryFn: () => health().check(),
  staleTime: TimeMs.m5,
  refetchInterval: TimeMs.m5,
  retry: 0,
});
