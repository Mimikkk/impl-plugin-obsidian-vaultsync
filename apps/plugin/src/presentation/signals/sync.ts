import { SyncService } from "@plugin/application/services/SyncService.ts";
import { createActionSignal } from "@plugin/infrastructure/signals/createActionSignal.ts";
import { useMutation } from "@tanstack/solid-query";

export const [sync, isSyncing] = createActionSignal(SyncService.sync);

export const useSync = () =>
  useMutation(() => ({
    mutationKey: ["sync"],
    mutationFn: sync,
  }));
