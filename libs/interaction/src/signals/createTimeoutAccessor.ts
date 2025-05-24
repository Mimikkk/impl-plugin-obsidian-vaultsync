import { createTimeout } from "@interaction/signals/createTimeout.ts";
import { TimeMs } from "@nimir/shared";
import { createEffect, createSignal } from "solid-js";

export const createTimeoutAccessor = (when: () => boolean, ms: number = TimeMs.s1) => {
  const [get, set] = createSignal(false);

  createEffect(() => {
    if (when()) {
      set(false);
      return;
    }

    set(true);
    createTimeout(() => set(false), ms);
  });

  return get;
};
