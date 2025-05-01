import type { Command } from "obsidian";
import { createEffect, createMemo, createSignal } from "solid-js";
import { definePlugin } from "./infrastructure/definePlugin.ts";
import { createLoadingSignal } from "./infrastructure/signals/createLoadingSignal.ts";
import "./styles.css";

let button!: HTMLElement;
let status!: HTMLElement;
let command!: Command;

const root = document.createElement("div");
root.id = "sync-plugin-root";

const [sync, isSyncing] = createLoadingSignal(async () => {
  console.log("Synchronizing...");
  await sleep(5000);
  console.log("Synchronized.");
});

const [isMounted, setIsMounted] = createSignal(false);

createEffect(() => {
  if (isMounted()) {
    console.log("Sync plugin mounted.");
  } else {
    console.log("Sync plugin unmounted.");
  }
});

createEffect(() => {
  if (!isMounted()) return;

  if (isSyncing()) {
    button.setAttribute("aria-disabled", "true");
    button.classList.toggle("!cursor-not-allowed", true);
  } else {
    button.removeAttribute("aria-disabled");
    button.classList.toggle("!cursor-not-allowed", false);
  }
});

let timeout!: number;
export default definePlugin({
  onMount(plugin) {
    document.body.appendChild(root);

    button = plugin.addRibbonIcon("cloud", "Synchronize", sync);
    command = plugin.addCommand({ id: "synchronize", name: "Synchronize", icon: "cloud", callback: sync });
    status = plugin.addStatusBarItem();

    const [isSynced, setIsSynced] = createSignal(false);

    const statusBarValue = createMemo(() => {
      if (isSyncing()) {
        setIsSynced(false);
        return (`
        <div class="flex items-center gap-2 text-sm">
          <div class="icon !h-4 !w-4">
            <svg class="animate-[spin_2s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
          </div>
          <span class="text-sm">Synchronizing...</span>
        </div>
      `);
      }

      if (isSynced()) {
        return (`
        <div class="flex items-center gap-2 text-sm">
          <span class="text-sm">Synchronized.</span>
        </div>
      `);
      }

      return "";
    });

    createEffect(() => {
      status.setHTMLUnsafe(statusBarValue());
    });

    createEffect(() => {
      if (!isSyncing()) {
        setIsSynced(true);

        timeout = setTimeout(() => {
          setIsSynced(false);
        }, 1000);
      }
    });

    setIsMounted(true);
  },
  onTeardown() {
    clearTimeout(timeout);
    document.body.removeChild(root);

    setIsMounted(false);
  },
});
