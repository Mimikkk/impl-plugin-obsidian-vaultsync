import { onCleanup } from "solid-js";
import { cleanupQueryClient } from "../../infrastructure/clients/QueryClient.ts";

export const createUnmountEffect = () => {
  console.info("Sync plugin mounted.");

  onCleanup(async () => {
    await cleanupQueryClient();

    console.info("Sync plugin unmounted.");
  });
};
