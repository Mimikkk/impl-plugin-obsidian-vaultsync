import { useHealthStatus } from "@plugin/application/queries/useHealthStatus.ts";
import cx from "clsx";
import { createMemo } from "solid-js";
import { withQueryClient } from "../../../../shared/components/withQueryClient.tsx";
import { Status } from "../../../../shared/types/Status.ts";

export const RibbonBar = withQueryClient(() => (
  <>
    <RibbonServiceStatus />
  </>
));

const RibbonServiceStatus = () => {
  const status = useHealthStatus();

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
        return "Checking health...";
      case Status.Error:
        return "Server is not responding. Please check your connection.";
      case Status.Success:
        return "Server is live.";
      default:
        return undefined;
    }
  });

  return <div aria-label={label()} class={cx("absolute top-0.5 right-0.5 w-2 h-2 rounded-full", color())} />;
};
