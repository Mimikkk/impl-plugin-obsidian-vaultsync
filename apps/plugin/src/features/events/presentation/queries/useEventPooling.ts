import { di } from "@nimir/framework";
import { lazy } from "@nimir/shared";
import { TEventService } from "@plugin/features/events/application/services/EventService.ts";
import { useLatestEventId } from "@plugin/features/events/presentation/queries/useLatestEventId.ts";
import { usePoolEvents } from "@plugin/features/events/presentation/queries/usePoolEvents.ts";

const events = lazy(() => di.of(TEventService));
export const useEventPooling = () => {
  const latestQuery = useLatestEventId();

  const eventsQuery = usePoolEvents({
    queryFn: () => events().pool({ since: latestQuery.data }),
    enabled: () => !latestQuery.isLoading,
  });

  return { events: eventsQuery, latest: latestQuery };
};
