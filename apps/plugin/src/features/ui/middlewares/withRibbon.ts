import { defer } from "@nimir/interaction";
import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { useHealthCheck } from "@plugin/features/health/presentation/queries/useHealthCheck.ts";
import { useSync } from "@plugin/features/synchronization/presentation/mutations/useSync.ts";
import { RibbonBar } from "@plugin/features/ui/presentation/components/RibbonBar.tsx";
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

export const withRibbon = createMiddleware((plugin) => {
  const { mutate } = useSync();
  const { refetch } = useHealthCheck();

  const ribbon = plugin.addRibbonIcon("cloud", "Synchronize", async () => {
    const result = await refetch();
    if (!result.isSuccess) return;

    return mutate();
  });
  createRibbonAdapterEffect(ribbon);

  const root = ribbon.createDiv("div");
  onCleanup(() => root.remove());

  render(RibbonBar, root);
});
