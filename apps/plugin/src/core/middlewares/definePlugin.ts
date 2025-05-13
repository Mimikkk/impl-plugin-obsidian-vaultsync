import type { Awaitable } from "@nimir/shared";
import { composeMiddleware, type Middleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { Plugin } from "obsidian";
import { createRoot } from "solid-js";

export const definePlugin = (middlewares: Middleware[]) => {
  const root = document.createElement("div");
  root.id = "vault-sync-plugin-root";
  let cleanup: () => Awaitable<void>;

  return class extends Plugin {
    override onload() {
      createRoot((dispose) => {
        document.body.appendChild(root);

        cleanup = () => {
          dispose();
          document.body.removeChild(root);
        };

        composeMiddleware(...middlewares)(this);
      });
    }

    override async onunload() {
      await cleanup();
    }
  };
};
