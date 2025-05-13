import { EventService } from "@plugin/application/services/EventService.ts";
import { createUseQuery } from "@plugin/infrastructure/queries/createUseQuery.ts";

export const useLatestEventId = createUseQuery({
  queryKey: ["latest-event-id"],
  queryFn: async () => {
    await EventService.scan();

    const event = await EventService.latest();

    return event?.id ?? 0;
  },
  refetchOnReconnect: true,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: 0,
});
