import { lazy } from "@nimir/shared";
import { createUseQuery } from "@plugin/core/infrastructure/queries/createUseQuery.ts";
import { EventService } from "../../services/EventService.ts";

const events = lazy(EventService.create);
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
