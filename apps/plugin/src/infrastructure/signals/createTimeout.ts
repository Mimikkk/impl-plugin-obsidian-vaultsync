import { onCleanup } from "solid-js";
import type { Awaitable } from "../../shared/types/common.ts";

export const createTimeout = (action: () => Awaitable<unknown>, ms: number) => {
  const timeout = setTimeout(action, ms);
  onCleanup(() => clearTimeout(timeout));
};
