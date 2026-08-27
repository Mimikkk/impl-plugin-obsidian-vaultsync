import { EventClient } from "@plugin/core/infrastructure/clients/EventClient";
import { useLatestEventId } from "@plugin/features/events/useLatestEventId";
import { usePoolEvents } from "@plugin/features/events/usePoolEvents";

export const useEventPooling = () => {
  const latestQuery = useLatestEventId();

  const eventsQuery = usePoolEvents({
    queryFn: () => EventClient.events.fetch({ params: { since: latestQuery.data } }),
    enabled: () => latestQuery.isSuccess,
  });

  return { events: eventsQuery, latest: latestQuery };
};
