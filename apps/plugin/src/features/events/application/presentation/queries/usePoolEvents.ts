import { EventService } from "../../services/EventService.ts";
import { createUseQuery } from "@plugin/core/infrastructure/queries/createUseQuery.ts";
import { TimeMs } from "@nimir/shared";

export const usePoolEvents = createUseQuery({
  queryKey: ["pool-events"],
  queryFn: () => EventService.create().pool(),
  refetchInterval: TimeMs.seconds(5),
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  gcTime: 0,
  staleTime: 0,
  retry: 0,
});
