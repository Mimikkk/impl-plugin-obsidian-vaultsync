import { createAdapter } from "@plugin/features/interface/infrastructure/createAdapter.ts";
import { useSync } from "@plugin/features/synchronization/presentation/signals/useSync.ts";

export const adaptCommands = createAdapter((plugin) => {
  const [sync] = useSync();

  plugin.addCommand({ id: "synchronize", name: "Synchronize", icon: "cloud", callback: sync });
});
