import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { ObsidianManagerAdapter } from "../adapters/obsidian/ObsidianManagerAdapter.ts";
import { StateProvider } from "../infrastructure/SyncStateProvider.ts";

export const withSyncState = createMiddleware(async (plugin) => {
  const manager = await ObsidianManagerAdapter.from(plugin);

  const state = StateProvider.from(manager);

  return state;
});
