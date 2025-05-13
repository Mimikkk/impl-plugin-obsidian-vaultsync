import { createAdapter } from "@plugin/features/ui/infrastructure/createAdapter.ts";
import { StatusBar } from "@plugin/features/ui/presentation/components/StatusBar.tsx";
import { render } from "solid-js/web";

export const adaptStatusBar = createAdapter((plugin) => {
  const element = plugin.addStatusBarItem();

  render(StatusBar, element);
});
