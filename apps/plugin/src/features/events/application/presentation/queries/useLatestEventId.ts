import { createUseQuery } from "@plugin/core/infrastructure/queries/createUseQuery.ts";
import { EventService } from "../../services/EventService.ts";

export const useLatestEventId = createUseQuery({
  queryKey: ["latest-event-id"],
  queryFn: async () => {
    await EventService.create().scan();

    const event = await EventService.create().latest();

    return event?.id ?? 0;
  },
  refetchOnReconnect: true,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: 0,
});
