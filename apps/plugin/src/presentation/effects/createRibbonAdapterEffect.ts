import { createEffect, on } from "solid-js";
import { defer } from "../../shared/values/common.ts";
import { useSync } from "../signals/useSync.ts";

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
