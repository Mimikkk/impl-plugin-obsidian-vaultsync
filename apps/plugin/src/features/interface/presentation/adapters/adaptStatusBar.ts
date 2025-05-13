import { createAdapter } from "@plugin/features/interface/infrastructure/createAdapter.ts";
import { StatusBar } from "@plugin/features/interface/presentation/components/StatusBar.tsx";
import { render } from "solid-js/web";

export const adaptStatusBar = createAdapter((plugin) => {
  const element = plugin.addStatusBarItem();

  render(StatusBar, element);
});
