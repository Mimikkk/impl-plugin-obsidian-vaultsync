import { Status, StatusNs, withQueryClient } from "@nimir/interaction";
import { useLatestEventId } from "@plugin/features/events/presentation/queries/useLatestEventId.ts";
import cx from "clsx";
import { createMemo } from "solid-js";
import { useHealthCheck } from "../../../health/presentation/queries/useHealthCheck.ts";

export const RibbonBar = withQueryClient(() => <RibbonServiceStatus />);

const RibbonServiceStatus = () => {
  const status = StatusNs.accessQuery(useHealthCheck());
  const latestEventId = useLatestEventId();

  console.log({ latestEventId });

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
