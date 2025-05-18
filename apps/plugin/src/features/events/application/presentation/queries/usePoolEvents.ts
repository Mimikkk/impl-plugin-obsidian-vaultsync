import { lazy, TimeMs } from "@nimir/shared";
import { createUseQuery } from "@plugin/core/infrastructure/queries/createUseQuery.ts";
import { EventService } from "../../services/EventService.ts";

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
