import { QueryClientNs } from "@nimir/interaction";
import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { onCleanup } from "solid-js";

export const withCleanup = createMiddleware(() => {
  console.info("Sync plugin mounted.");

  onCleanup(async () => {
    await QueryClientNs.cleanup();

    console.info("Sync plugin unmounted.");
  });
});
