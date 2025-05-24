import { defer } from "@nimir/interaction";
import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { useHealthCheck } from "@plugin/features/health/presentation/queries/useHealthCheck.ts";
import { useSync } from "@plugin/features/synchronization/presentation/mutations/useSync.ts";
import { StatusIndicator } from "@plugin/features/ui/presentation/components/StatusIndicator.tsx";
import { StatusMiniIndicator } from "@plugin/features/ui/presentation/components/StatusMiniIndicator.tsx";
import { createEffect, on, onCleanup } from "solid-js";
import { render } from "solid-js/web";

export const createRibbonAdapterEffect = (button: HTMLElement) => {
  const { isError } = useHealthCheck();
  const { isMutating } = useSync();

  button.classList.add("relative");
  createEffect(on(() => [isMutating(), isError], ([isMutating, isError]) => {
    if (isMutating || isError) {
      button.setAttribute("aria-disabled", "true");
      button.classList.toggle("!cursor-not-allowed", true);
    } else {
      button.removeAttribute("aria-disabled");
      button.classList.toggle("!cursor-not-allowed", false);
    }
  }, defer));
};

const findMenu = (mutations: MutationRecord[]) => {
  for (const mutation of mutations) {
    if (mutation.type !== "childList") continue;

    for (const node of mutation.addedNodes) {
      if (node instanceof HTMLElement && node.classList.contains("menu")) {
        const menus = node.querySelectorAll(".menu-scroll .menu-item");

        for (const menu of menus) {
          if (menu.textContent !== "Synchronize") continue;
          return menu;
        }
      }
    }
  }
};

const observer = new MutationObserver((mutations) => {
  const menu = findMenu(mutations);
  if (!menu) return;

  const icon = menu.querySelector(".menu-item-icon");
  if (!icon) return;

  const { isError } = useHealthCheck();
  const { isMutating } = useSync();

  icon.classList.add("relative");

  createEffect(on(() => [isMutating(), isError], ([isMutating, isError]) => {
    if (isMutating || isError) {
      menu.classList.toggle("!opacity-50", true);
      menu.classList.toggle("!touch-none", true);
      menu.classList.toggle("!pointer-events-none", true);
    } else {
      menu.classList.toggle("!opacity-50", false);
      menu.classList.toggle("!touch-none", false);
      menu.classList.toggle("!pointer-events-none", false);
    }
  }));

  render(StatusMiniIndicator, icon);
});

export const createMenuAdapterEffect = () => {
  observer.observe(document.body, { childList: true });
};

export const withRibbon = createMiddleware((plugin) => {
  const { mutate } = useSync();
  const { refetch } = useHealthCheck();

  const ribbon = plugin.addRibbonIcon("cloud", "Synchronize", async () => {
    const result = await refetch();
    if (!result.isSuccess) return;

    return mutate();
  });

  createRibbonAdapterEffect(ribbon);
  createMenuAdapterEffect();

  const root = ribbon.createDiv("div");
  onCleanup(() => root.remove());

  render(StatusIndicator, root);
});
