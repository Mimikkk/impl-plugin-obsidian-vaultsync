import { definePlugin } from "@plugin/features/interface/infrastructure/definePlugin.ts";
import { adaptCommands } from "@plugin/features/interface/presentation/adapters/adaptCommands.ts";
import { adaptRibbon } from "@plugin/features/interface/presentation/adapters/adaptRibbon.ts";
import { adaptStatusBar } from "@plugin/features/interface/presentation/adapters/adaptStatusBar.ts";
import { createUnmountEffect } from "@plugin/features/interface/presentation/effects/createUnmountEffect.ts";
import { ClientState } from "@plugin/features/interface/presentation/state/ClientState.ts";
import { useSync } from "@plugin/features/synchronization/presentation/signals/useSync.ts";
import "./styles.css";

export default definePlugin((plugin) => {
  adaptCommands(plugin);
  adaptRibbon(plugin);
  adaptStatusBar(plugin);

  ClientState.fromPlugin(plugin);

  useSync().mutate();

  createUnmountEffect();
});
