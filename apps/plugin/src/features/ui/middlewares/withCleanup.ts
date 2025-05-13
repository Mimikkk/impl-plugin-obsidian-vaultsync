import { cleanupQueryClient } from "@plugin/core/infrastructure/clients/internal/QueryClient.ts";
import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { onCleanup } from "solid-js";

export const withCleanup = createMiddleware(() => {
  console.info("Sync plugin mounted.");

  onCleanup(async () => {
    await cleanupQueryClient();

    console.info("Sync plugin unmounted.");
  });
});
