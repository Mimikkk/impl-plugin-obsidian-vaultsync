import { useSync } from "@plugin/features/synchronization/presentation/signals/useSync.ts";
import { createAdapter } from "@plugin/features/ui/infrastructure/createAdapter.ts";
import { createRibbonAdapterEffect } from "@plugin/features/ui/presentation/effects/createRibbonAdapterEffect.ts";
import { onCleanup } from "solid-js";
import { render } from "solid-js/web";
import { RibbonBar } from "../components/RibbonBar.tsx";

export const adaptRibbon = createAdapter((plugin) => {
  const [sync] = useSync();
  const ribbon = plugin.addRibbonIcon("cloud", "Synchronize", () => sync());
  createRibbonAdapterEffect(ribbon);

  const root = ribbon.createDiv("div");
  onCleanup(() => root.remove());

  render(RibbonBar, root);
});
