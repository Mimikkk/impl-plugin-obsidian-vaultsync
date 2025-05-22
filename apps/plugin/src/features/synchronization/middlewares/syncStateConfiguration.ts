import type { StateConfiguration } from "../../../core/middlewares/presets/withState.ts";
import { SyncState, SyncStateSchema } from "@plugin/features/synchronization/infrastructure/SyncState.ts";
import { TFile } from "obsidian";

export const syncStateConfiguration: StateConfiguration = {
  state: SyncState,
  schema: SyncStateSchema,
  setup(plugin) {
    plugin.registerEvent(plugin.app.vault.on("delete", (file) => {
      if (!(file instanceof TFile)) return;

      SyncState.set("deletedFiles", (previous) => {
        previous.set(file.path, performance.now());
        return previous;
      });
    }));
  },
};
