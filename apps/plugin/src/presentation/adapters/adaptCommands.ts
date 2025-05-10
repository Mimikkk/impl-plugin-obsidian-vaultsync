import { sync } from "@plugin/application/signals/sync.ts";
import { createAdapter } from "@plugin/infrastructure/createAdapter.ts";

export const adaptCommands = createAdapter((plugin) => {
  plugin.addCommand({ id: "synchronize", name: "Synchronize", icon: "cloud", callback: sync });
});
