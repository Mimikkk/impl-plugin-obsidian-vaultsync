import { adaptCommands } from "@plugin/presentation/adapters/adaptCommands.ts";
import { useSync } from "@plugin/presentation/signals/useSync.ts";
import { definePlugin } from "./infrastructure/definePlugin.ts";
import { adaptRibbon } from "./presentation/adapters/adaptRibbon.ts";
import { adaptStatusBar } from "./presentation/adapters/adaptStatusBar.ts";
import { createUnmountEffect } from "./presentation/effects/createUnmountEffect.ts";
import "./styles.css";

export default definePlugin((plugin) => {
  adaptCommands(plugin);
  adaptRibbon(plugin);
  adaptStatusBar(plugin);

  useSync().mutate();

  createUnmountEffect();
});
