import { defer } from "@plugin/shared/commonFns.ts";
import { createEffect, on, onCleanup } from "solid-js";
import { definePlugin } from "./infrastructure/definePlugin.ts";
import { isSyncing, sync } from "./domain/signals/isSyncing.ts";
import { createStatusBar } from "./presentation/statusbar/createStatusBar.tsx";
import { Self } from "./domain/Self.ts";
import "./styles.css";

const createButtonEffect = () =>
  createEffect(on(isSyncing, (value) => {
    if (value) {
      Self.button.setAttribute("aria-disabled", "true");
      Self.button.classList.toggle("!cursor-not-allowed", true);
    } else {
      Self.button.removeAttribute("aria-disabled");
      Self.button.classList.toggle("!cursor-not-allowed", false);
    }
  }, defer));

const createUnmountEffect = () => {
  console.log("Sync plugin mounted.");

  onCleanup(() => {
    console.log("Sync plugin unmounted.");
  });
};

export default definePlugin((plugin) => {
  Self.button = plugin.addRibbonIcon("cloud", "Synchronize", sync);
  Self.command = plugin.addCommand({ id: "synchronize", name: "Synchronize", icon: "cloud", callback: sync });
  Self.status = plugin.addStatusBarItem();

  createButtonEffect();
  createStatusBar();

  createUnmountEffect();
});
