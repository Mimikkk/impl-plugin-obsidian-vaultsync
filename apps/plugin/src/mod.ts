import { definePlugin } from "./core/middlewares/definePlugin.ts";
import { withSyncState } from "./features/state/middlewares/withSyncState.ts";
import { withUI } from "./features/ui/middlewares/withUI.ts";
import "./styles.css";

export default definePlugin([
  withSyncState,
  withUI,
]);
