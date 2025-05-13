import { useSync } from "@plugin/features/synchronization/presentation/signals/useSync.ts";
import { createAdapter } from "@plugin/features/ui/infrastructure/createAdapter.ts";

export const adaptCommands = createAdapter((plugin) => {
  const [sync] = useSync();

  plugin.addCommand({ id: "synchronize", name: "Synchronize", icon: "cloud", callback: sync });
});
