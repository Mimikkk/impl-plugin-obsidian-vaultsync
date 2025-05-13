import { withState } from "@plugin/features/state/middlewares/withState.ts";
import { definePlugin } from "@plugin/features/ui/infrastructure/definePlugin.ts";
import { withUI } from "./features/ui/presentation/middlewares/withUI.ts";
import "./styles.css";

export default definePlugin([
  withState,
  withUI,
]);
