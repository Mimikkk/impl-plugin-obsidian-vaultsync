import { createUseQuery } from "@nimir/interaction";
import { lazy, TimeMs } from "@nimir/shared";
import { EventService } from "../../application/services/EventService.ts";

const events = lazy(EventService.create);
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
