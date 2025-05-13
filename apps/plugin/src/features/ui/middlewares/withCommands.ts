import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { useSync } from "@plugin/features/synchronization/presentation/mutations/useSync.ts";

export const withCommands = createMiddleware((plugin) => {
  const [sync] = useSync();

  plugin.addCommand({ id: "synchronize", name: "Synchronize", icon: "cloud", callback: () => sync() });
});
