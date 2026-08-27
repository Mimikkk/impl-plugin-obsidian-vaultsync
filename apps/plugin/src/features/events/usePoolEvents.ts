import { createUseQuery } from "@nimir/interaction";
import { TimeMs } from "@nimir/shared";
import { EventClient } from "@plugin/core/infrastructure/clients/EventClient";

export const usePoolEvents = createUseQuery({
  queryKey: ["pool-events"],
  queryFn: () => EventClient.events.fetch({ params: {} }),
  refetchInterval: TimeMs.seconds(60),
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  gcTime: 0,
  staleTime: 0,
  retry: false,
});
