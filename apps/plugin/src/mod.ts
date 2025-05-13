import { useSync } from "@plugin/features/synchronization/presentation/signals/useSync.ts";
import { definePlugin } from "@plugin/features/ui/infrastructure/definePlugin.ts";
import { adaptCommands } from "@plugin/features/ui/presentation/adapters/adaptCommands.ts";
import { adaptRibbon } from "@plugin/features/ui/presentation/adapters/adaptRibbon.ts";
import { adaptStatusBar } from "@plugin/features/ui/presentation/adapters/adaptStatusBar.ts";
import { createUnmountEffect } from "@plugin/features/ui/presentation/effects/createUnmountEffect.ts";
import { ClientState } from "@plugin/features/ui/presentation/state/ClientState.ts";
import "./styles.css";

export default definePlugin((plugin) => {
  adaptCommands(plugin);
  adaptRibbon(plugin);
  adaptStatusBar(plugin);

  ClientState.fromPlugin(plugin);

  useSync().mutate();

  createUnmountEffect();
});
