import { createUseQuery, QueryClientNs } from "@nimir/interaction";
import { TimeMs } from "@nimir/shared";
import { HealthClient } from "@plugin/core/infrastructure/clients/HealthClient";

export const useHealthCheck = createUseQuery({
  queryKey: ["health-check"],
  queryFn: () => HealthClient.check.fetch({}),
  staleTime: TimeMs.m5,
  refetchInterval: TimeMs.m5,
  retry: false,
});

export const invalidateHealthCheck = () => {
  QueryClientNs.get().invalidateQueries({ queryKey: ["health-check"] });
};
