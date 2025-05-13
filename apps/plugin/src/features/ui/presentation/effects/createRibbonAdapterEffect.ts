import { defer } from "@plugin/core/infrastructure/consts/conts.ts";
import { useSync } from "@plugin/features/synchronization/presentation/signals/useSync.ts";
import { createEffect, on } from "solid-js";

export const createRibbonAdapterEffect = (button: HTMLElement) => {
  const { isMutating } = useSync();

  button.classList.add("relative");

  createEffect(on(isMutating, (value) => {
    if (value) {
      button.setAttribute("aria-disabled", "true");
      button.classList.toggle("!cursor-not-allowed", true);
    } else {
      button.removeAttribute("aria-disabled");
      button.classList.toggle("!cursor-not-allowed", false);
    }
  }, defer));
};
