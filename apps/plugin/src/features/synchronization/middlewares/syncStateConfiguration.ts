import { resolve } from "@nimir/framework";
import { SyncState, SyncStateSchema } from "@plugin/features/synchronization/infrastructure/SyncState.ts";
import { TFile } from "obsidian";
import type { StateConfiguration } from "../../../core/middlewares/presets/withState.ts";

const state = resolve(SyncState);
const schema = resolve(SyncStateSchema);

export const syncStateConfiguration: StateConfiguration = {
  state,
  schema,
  setup(plugin) {
    plugin.registerEvent(plugin.app.vault.on("delete", (file) => {
      if (!(file instanceof TFile)) return;

      state.set("deletedFiles", (previous) => {
        previous.set(file.path, performance.now());
        return previous;
      });
    }));
  },
};
