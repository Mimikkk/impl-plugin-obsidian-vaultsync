import { createAdapter } from "@plugin/infrastructure/createAdapter.ts";
import { StatusBar } from "@plugin/presentation/modules/statusbar/components/StatusBar.tsx";
import { render } from "solid-js/web";

export const adaptStatusBar = createAdapter((plugin) => {
  const element = plugin.addStatusBarItem();

  render(StatusBar, element);
});
