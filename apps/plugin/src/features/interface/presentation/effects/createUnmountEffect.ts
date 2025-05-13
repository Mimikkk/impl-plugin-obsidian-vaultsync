import { cleanupQueryClient } from "@plugin/core/infrastructure/clients/internal/QueryClient.ts";
import { onCleanup } from "solid-js";

export const createUnmountEffect = () => {
  console.info("Sync plugin mounted.");

  onCleanup(async () => {
    await cleanupQueryClient();

    console.info("Sync plugin unmounted.");
  });
};
