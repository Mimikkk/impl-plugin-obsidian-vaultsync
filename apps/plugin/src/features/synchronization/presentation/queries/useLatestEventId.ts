import { createUseQuery } from "@plugin/core/infrastructure/queries/createUseQuery.ts";
import { EventService } from "@plugin/features/synchronization/application/services/EventService.ts";

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
