import { definePlugin } from "./core/middlewares/definePlugin.ts";
import { withState } from "./core/middlewares/presets/withState.ts";
import { syncStateConfiguration } from "./features/synchronization/middlewares/syncStateConfiguration.ts";
import { withUI } from "./features/ui/middlewares/withUI.ts";
import "./styles.css";

export default definePlugin([
  withState({ sync: syncStateConfiguration }),
  withUI,
]);
