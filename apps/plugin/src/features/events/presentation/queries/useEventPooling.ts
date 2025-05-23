import { lazyResolve } from "@nimir/framework";
import { EventService } from "@plugin/features/events/application/services/EventService.ts";
import { useLatestEventId } from "@plugin/features/events/presentation/queries/useLatestEventId.ts";
import { usePoolEvents } from "@plugin/features/events/presentation/queries/usePoolEvents.ts";

const events = lazyResolve(EventService);
export const useEventPooling = () => {
  const latestQuery = useLatestEventId();

  const eventsQuery = usePoolEvents({
    queryFn: () => events().pool({ since: latestQuery.data }),
    enabled: () => !latestQuery.isLoading,
  });

  return { events: eventsQuery, latest: latestQuery };
};
