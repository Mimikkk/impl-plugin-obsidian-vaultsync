import { createMiddleware } from "@plugin/core/infrastructure/createMiddleware.ts";
import { ManagerAdapter } from "@plugin/features/state/adapters/obsidian/ManagerAdapter.ts";
import { StateProvider } from "@plugin/features/state/infrastructure/StateProvider.ts";

export const withState = createMiddleware(async (plugin) => {
  const manager = await ManagerAdapter.from(plugin);
  const state = StateProvider.from(manager);

  return state;
});
