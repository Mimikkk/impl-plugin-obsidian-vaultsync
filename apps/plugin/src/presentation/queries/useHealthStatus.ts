import { TimeMs } from "@nimir/shared";
import { SyncService } from "@plugin/application/services/SyncService.ts";
import { useQuery } from "@tanstack/solid-query";
import { Status } from "../../infrastructure/types/Status.ts";

const key = ["health"];
export const useHealthStatus = () =>
  Status.accessQuery(useQuery(() => ({
    queryKey: key,
    queryFn: SyncService.health,
    staleTime: TimeMs.m5,
    refetchInterval: TimeMs.m5,
    retry: 0,
  })));
