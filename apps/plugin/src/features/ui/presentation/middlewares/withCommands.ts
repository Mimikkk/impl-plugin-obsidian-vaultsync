import { createMiddleware } from "@plugin/core/infrastructure/createMiddleware.ts";
import { useSync } from "@plugin/features/synchronization/presentation/signals/useSync.ts";

export const withCommands = createMiddleware((plugin) => {
  const [sync] = useSync();

  plugin.addCommand({ id: "synchronize", name: "Synchronize", icon: "cloud", callback: () => sync() });
});
