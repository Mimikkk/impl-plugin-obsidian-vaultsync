import { createAdapter } from "@plugin/infrastructure/createAdapter.ts";
import { createRibbonAdapterEffect } from "@plugin/presentation/effects/createRibbonAdapterEffect.ts";
import { onCleanup } from "solid-js";
import { render } from "solid-js/web";
import { RibbonBar } from "../components/RibbonBar.tsx";
import { useSync } from "../signals/useSync.ts";

export const adaptRibbon = createAdapter((plugin) => {
  const [sync] = useSync();
  const ribbon = plugin.addRibbonIcon("cloud", "Synchronize", () => sync());
  createRibbonAdapterEffect(ribbon);

  const root = ribbon.createDiv("div");
  onCleanup(() => root.remove());

  render(RibbonBar, root);
});
