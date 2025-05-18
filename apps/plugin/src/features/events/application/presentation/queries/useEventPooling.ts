import { lazy } from "@nimir/shared";
import { useLatestEventId } from "@plugin/features/events/application/presentation/queries/useLatestEventId.ts";
import { usePoolEvents } from "@plugin/features/events/application/presentation/queries/usePoolEvents.ts";
import { EventService } from "@plugin/features/events/application/services/EventService.ts";

const events = lazy(EventService.create);
export const useEventPooling = () => {
  const latestQuery = useLatestEventId();

  const eventsQuery = usePoolEvents({
    queryFn: () => events().pool({ since: latestQuery.data }),
    enabled: () => !latestQuery.isLoading,
  });

  return { events: eventsQuery, latest: latestQuery };
};
