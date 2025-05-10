import type { Awaitable } from "@plugin/shared/types/common.ts";
import { onCleanup } from "solid-js";

export const createTimeout = (action: () => Awaitable<unknown>, ms: number) => {
  const timeout = setTimeout(action, ms);
  onCleanup(() => clearTimeout(timeout));
};
