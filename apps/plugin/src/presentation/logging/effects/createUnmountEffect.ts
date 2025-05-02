import { onCleanup } from "solid-js";
import { cleanupQueryClient } from "../../../shared/values/queryClient.ts";

export const createUnmountEffect = () => {
  console.info("Sync plugin mounted.");

  onCleanup(async () => {
    await cleanupQueryClient();

    console.info("Sync plugin unmounted.");
  });
};
