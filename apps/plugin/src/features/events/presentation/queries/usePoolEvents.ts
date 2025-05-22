import { di } from "@nimir/framework";
import { createUseQuery } from "@nimir/interaction";
import { lazy, TimeMs } from "@nimir/shared";
import { TEventService } from "@plugin/features/events/application/services/EventService.ts";

const events = lazy(() => di.of(TEventService));
export const usePoolEvents = createUseQuery({
  queryKey: ["pool-events"],
  queryFn: () => events().pool(),
  refetchInterval: TimeMs.seconds(5),
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  gcTime: 0,
  staleTime: 0,
  retry: 0,
});
