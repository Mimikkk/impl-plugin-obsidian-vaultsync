import { VaultSyncService } from "@plugin/application/services/VaultSyncService.ts";
import { useQuery } from "@tanstack/solid-query";
import { type Accessor, createMemo } from "solid-js";
import { Status } from "../../shared/types/Status.ts";
import { TimeMs } from "../../shared/values/timeMs.ts";

const key = ["health"];
export const useHealthStatus = (): Accessor<Status> => {
  const result = useQuery(() => ({
    queryKey: key,
    queryFn: VaultSyncService.health,
    staleTime: TimeMs.m5,
    refetchInterval: TimeMs.m5,
    retry: 0,
  }));

  return createMemo(() => Status.fromQuery(result));
};
