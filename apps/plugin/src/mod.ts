import { adaptCommands } from "@plugin/presentation/adapters/adaptCommands.ts";
import { useSync } from "@plugin/presentation/signals/useSync.ts";
import { definePlugin } from "./infrastructure/definePlugin.ts";
import { adaptRibbon } from "./presentation/adapters/adaptRibbon.ts";
import { adaptStatusBar } from "./presentation/adapters/adaptStatusBar.ts";
import { createUnmountEffect } from "./presentation/effects/createUnmountEffect.ts";
import { ClientState } from "./presentation/state/ClientState.ts";
import "./styles.css";

export default definePlugin(async (plugin) => {
  adaptCommands(plugin);
  adaptRibbon(plugin);
  adaptStatusBar(plugin);

  ClientState.fromPlugin(plugin);

  useSync().mutate();

  createUnmountEffect();
});
