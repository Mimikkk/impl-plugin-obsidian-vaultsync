import { sync } from "@plugin/domain/signals/isSyncing.ts";
import { createAdapter } from "@plugin/infrastructure/createAdapter.ts";
import { createRibbonAdapterEffect } from "@plugin/presentation/modules/ribbon/effects/createRibbonAdapterEffect.ts";
import { onCleanup } from "solid-js";
import { render } from "solid-js/web";
import { RibbonBar } from "./components/RibbonBar.tsx";

export const adaptRibbon = createAdapter((plugin) => {
  const ribbon = plugin.addRibbonIcon("cloud", "Synchronize", sync);
  createRibbonAdapterEffect(ribbon);

  const root = ribbon.createDiv("div");
  onCleanup(() => root.remove());

  render(RibbonBar, root);
});
