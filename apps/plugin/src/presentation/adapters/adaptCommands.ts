import { createAdapter } from "@plugin/infrastructure/createAdapter.ts";
import { sync } from "@plugin/presentation/signals/sync.ts";

export const adaptCommands = createAdapter((plugin) => {
  plugin.addCommand({ id: "synchronize", name: "Synchronize", icon: "cloud", callback: sync });
});
