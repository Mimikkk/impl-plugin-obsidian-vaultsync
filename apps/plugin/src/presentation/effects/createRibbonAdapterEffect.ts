import { isSyncing } from "@plugin/domain/signals/isSyncing.ts";
import { createEffect, on } from "solid-js";
import { defer } from "../../shared/values/common.ts";

export const createRibbonAdapterEffect = (button: HTMLElement) => {
  button.classList.add("relative");

  createEffect(on(isSyncing, (value) => {
    if (value) {
      button.setAttribute("aria-disabled", "true");
      button.classList.toggle("!cursor-not-allowed", true);
    } else {
      button.removeAttribute("aria-disabled");
      button.classList.toggle("!cursor-not-allowed", false);
    }
  }, defer));
};
