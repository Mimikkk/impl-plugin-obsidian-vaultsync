import { ManagerAdapter } from "@plugin/features/state/adapters/obsidian/ManagerAdapter.ts";
import { StateProvider } from "@plugin/features/state/infrastructure/StateProvider.ts";
import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";

export const withState = createMiddleware(async (plugin) => {
  const manager = await ManagerAdapter.from(plugin);
  const state = StateProvider.from(manager);

  return state;
});
