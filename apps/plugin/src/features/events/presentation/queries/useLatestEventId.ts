import { di } from "@nimir/framework";
import { createUseQuery } from "@nimir/interaction";
import { lazy } from "@nimir/shared";
import { TEventService } from "@plugin/features/events/application/services/EventService.ts";

const events = lazy(() => di.of(TEventService));
export const useLatestEventId = createUseQuery({
  queryKey: ["latest-event-id"],
  async queryFn() {
    const service = events();

    await service.scan();
    const event = await service.latest();

    return event?.id ?? 0;
  },
  refetchOnReconnect: true,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: 0,
});
