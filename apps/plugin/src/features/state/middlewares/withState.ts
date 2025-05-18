import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { ManagerAdapter } from "../adapters/obsidian/ObsidianManagerAdapter.ts";
import { StateProvider } from "@plugin/features/state/infrastructure/StateProvider.ts";

export const withState = createMiddleware(async (plugin) => {
  const manager = await ManagerAdapter.from(plugin);

  const state = StateProvider.from(manager);

  return state;
});
