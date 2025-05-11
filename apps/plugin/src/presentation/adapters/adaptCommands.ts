import { createAdapter } from "@plugin/infrastructure/createAdapter.ts";
import { useSync } from "../signals/useSync.ts";

export const adaptCommands = createAdapter((plugin) => {
  const [sync] = useSync();

  plugin.addCommand({ id: "synchronize", name: "Synchronize", icon: "cloud", callback: sync });
});
