import { createTimeout } from "@plugin/core/infrastructure/signals/createTimeout.ts";
import { createEffect, createSignal } from "solid-js";

export const createTimeoutAccessor = (when: () => boolean, ms: number = 1000) => {
  const [get, set] = createSignal(false);

  createEffect(() => {
    if (!when()) return;

    set(true);
    createTimeout(() => set(false), ms);
  });

  return get;
};
