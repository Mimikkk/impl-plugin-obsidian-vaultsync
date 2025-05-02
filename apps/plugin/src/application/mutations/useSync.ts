import { VaultSyncService } from "@plugin/application/services/VaultSyncService.ts";
import { useMutation } from "@tanstack/solid-query";

const key = ["sync"];
export const useSync = () =>
  useMutation(() => ({
    mutationFn: VaultSyncService.sync,
    mutationKey: key,
  }));
