import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { ManagerAdapter } from "../adapters/obsidian/ObsidianManagerAdapter.ts";
import { StateProvider } from "../infrastructure/SyncStateProvider.ts";

export const withSyncState = createMiddleware(async (plugin) => {
  const manager = await ManagerAdapter.from(plugin);

  const state = StateProvider.from(manager);

  return state;
});
