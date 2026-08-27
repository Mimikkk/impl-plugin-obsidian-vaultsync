import { createUseQuery } from "@nimir/interaction";
import { EventClient } from "@plugin/core/infrastructure/clients/EventClient";

export const useLatestEventId = createUseQuery({
  queryKey: ["latest-event-id"],
  async queryFn() {
    const event = await EventClient.latest.fetch({});
    return event?.id ?? 0;
  },
  refetchOnReconnect: true,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: false,
});
