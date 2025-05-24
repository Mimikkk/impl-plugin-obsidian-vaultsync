import { lazyResolve } from "@nimir/framework";
import { createUseQuery } from "@nimir/interaction";
import { TimeMs } from "@nimir/shared";
import { EventService } from "@plugin/features/events/application/services/EventService.ts";

const events = lazyResolve(EventService);
export const usePoolEvents = createUseQuery({
  queryKey: ["pool-events"],
  queryFn: () => events().pool(),
  refetchInterval: TimeMs.seconds(60),
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  gcTime: 0,
  staleTime: 0,
  retry: false,
});
