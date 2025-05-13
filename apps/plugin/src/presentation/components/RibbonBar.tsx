import { EventService } from "@plugin/application/services/EventService.ts";
import cx from "clsx";
import { createMemo } from "solid-js";
import { withQueryClient } from "../../infrastructure/queries/withQueryClient.tsx";
import { Status } from "../../infrastructure/types/Status.ts";
import { useHealthCheck } from "../queries/useHealthCheck.ts";
import { useLatestEventId } from "../queries/useLatestEventId.ts";
import { usePoolEvents } from "../queries/usePoolEvents.ts";

export const RibbonBar = withQueryClient(() => <RibbonServiceStatus />);

const RibbonServiceStatus = () => {
  const status = Status.accessQuery(useHealthCheck());
  const { data: id, isLoading: isIdLoading } = useLatestEventId();

  usePoolEvents({
    queryFn: () => EventService.pool({ since: id }),
    enabled: () => !isIdLoading,
  });

  const color = createMemo(() => {
    switch (status()) {
      case Status.Loading:
        return "bg-blue-500";
      case Status.Error:
        return "bg-red-500";
      case Status.Success:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  });

  const label = createMemo(() => {
    switch (status()) {
      case Status.Loading:
        return "Checking sync service health...";
      case Status.Error:
        return "Sync service is not responding. Please check your connection.";
      case Status.Success:
        return "Sync service is live.";
      default:
        return undefined;
    }
  });

  return (
    <div
      aria-label={label()}
      data-tooltip-position="right"
      class={cx("absolute top-0.5 right-0.5 w-2 h-2 rounded-full", color())}
    />
  );
};
