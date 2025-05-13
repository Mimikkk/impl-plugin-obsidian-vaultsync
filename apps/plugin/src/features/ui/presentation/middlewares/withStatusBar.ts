import { createMiddleware } from "@plugin/core/infrastructure/createMiddleware.ts";
import { StatusBar } from "@plugin/features/ui/presentation/components/StatusBar.tsx";
import { render } from "solid-js/web";

export const withStatusBar = createMiddleware((plugin) => {
  const element = plugin.addStatusBarItem();

  render(StatusBar, element);
});
