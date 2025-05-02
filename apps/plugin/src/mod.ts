import { defer } from "@plugin/shared/commonFns.ts";
import type { Command } from "obsidian";
import { createEffect, createMemo, createSignal, on, onCleanup } from "solid-js";
import { definePlugin } from "./infrastructure/definePlugin.ts";
import { createLoadingSignal } from "./infrastructure/signals/createLoadingSignal.ts";
import "./styles.css";

export namespace Self {
  export let button!: HTMLElement;
  export let status!: HTMLElement;
  export let command!: Command;
}

const [sync, isSyncing] = createLoadingSignal(async () => {
  console.log("Synchronizing...");

  await sleep(2000);

  console.log("Synchronized.");
});

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

const createStatusBarEffect = () => {
  const [isSynced, setIsSynced] = createSignal(false);

  const label = createMemo(() => {
    if (isSyncing()) {
      setIsSynced(false);

      return (`
        <div class="flex items-center gap-1 -m-1">
          <div class="h-4 w-4 -my-1">
            <svg class="animate-[spin_2s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
          </div>
          <span>Synchronizing...</span>
        </div>
      `);
    }

    if (isSynced()) {
      return (`
        <div class="flex items-center gap-1">
          <span>Synchronized.</span>
        </div>
      `);
    }

    return "";
  });

  createEffect(on(isSyncing, (value) => {
    if (value) return;
    setIsSynced(true);

    const timeout = setTimeout(() => {
      setIsSynced(false);
    }, 1000);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  }, defer));

  createEffect(on(label, (value) => {
    Self.status.setHTMLUnsafe(value);
  }, defer));
};

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
  createStatusBarEffect();
  createUnmountEffect();
});
