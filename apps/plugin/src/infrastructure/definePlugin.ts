import { Plugin } from "obsidian";
import { createRoot } from "solid-js";
import type { Awaitable } from "../shared/types/common.ts";

export const definePlugin = (runtime: (plugin: Plugin) => Awaitable<void>) => {
  const root = document.createElement("div");
  root.id = "vault-sync-plugin-root";
  let cleanup: () => Awaitable<void>;

  return class extends Plugin {
    override async onload() {
      await createRoot(async (dispose) => {
        document.body.appendChild(root);

        cleanup = () => {
          document.body.removeChild(root);
          dispose();
        };

        await runtime(this);
      });
    }

    override async onunload() {
      await cleanup();
    }
  };
};
