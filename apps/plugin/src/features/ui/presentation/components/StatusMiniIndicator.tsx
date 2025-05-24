import { Status, StatusNs, withQueryClient } from "@nimir/interaction";
import cx from "clsx";
import { createMemo } from "solid-js";
import { useHealthCheck } from "../../../health/presentation/queries/useHealthCheck.ts";

export const StatusMiniIndicator = withQueryClient(() => <Indicator />);

const Indicator = () => {
  const status = StatusNs.accessQuery(useHealthCheck());

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
      class={cx("absolute top-0 right-0 w-1.5 h-1.5 rounded-full", color())}
    />
  );
};
