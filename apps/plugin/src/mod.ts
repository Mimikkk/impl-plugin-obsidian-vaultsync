import { adaptCommands } from "@plugin/presentation/modules/commands/adaptCommands.ts";
import { definePlugin } from "./infrastructure/definePlugin.ts";
import { createUnmountEffect } from "./presentation/logging/effects/createUnmountEffect.ts";
import { adaptRibbon } from "./presentation/modules/ribbon/adaptRibbon.ts";
import { adaptStatusBar } from "./presentation/modules/statusbar/adaptStatusBar.ts";
import "./styles.css";

export default definePlugin((plugin) => {
  adaptCommands(plugin);
  adaptRibbon(plugin);
  adaptStatusBar(plugin);

  createUnmountEffect();
});
