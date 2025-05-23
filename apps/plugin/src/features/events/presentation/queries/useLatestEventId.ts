import { lazyResolve } from "@nimir/framework";
import { createUseQuery } from "@nimir/interaction";
import { EventService } from "@plugin/features/events/application/services/EventService.ts";

const events = lazyResolve(EventService);
export const useLatestEventId = createUseQuery({
  queryKey: ["latest-event-id"],
  async queryFn() {
    const event = await events().latest();
    return event?.id ?? 0;
  },
  refetchOnReconnect: true,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: 0,
});
