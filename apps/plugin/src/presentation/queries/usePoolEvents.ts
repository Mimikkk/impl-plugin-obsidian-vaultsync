import { EventService } from "@plugin/application/services/EventService.ts";
import { createUseQuery } from "@plugin/infrastructure/mutations/createUseQUery.ts";
import { TimeMs } from "../../../../../libs/shared/src/mod.ts";

export const usePoolEvents = createUseQuery({
  queryKey: ["pool-events"],
  queryFn: EventService.pool,
  refetchInterval: TimeMs.seconds(5),
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  gcTime: 0,
  staleTime: 0,
  retry: 0,
  initialData: undefined,
});
