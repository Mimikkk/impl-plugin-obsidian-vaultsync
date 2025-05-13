import type { Awaitable } from "@nimir/shared";
import { onCleanup } from "solid-js";

export const createTimeout = (action: () => Awaitable<unknown>, ms: number) => {
  const timeout = setTimeout(action, ms);
  onCleanup(() => clearTimeout(timeout));
};
