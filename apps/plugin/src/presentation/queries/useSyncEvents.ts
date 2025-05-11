import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";
import { Status } from "../../infrastructure/types/Status.ts";

export const useSyncEvents = (options?: { enabled?: Accessor<boolean> }) =>
  Status.accessQuery(useQuery(() => ({
    queryKey: ["sync-events"],
    queryFn: async () => {
      return "OK";
    },
    // refetchInterval: TimeMs.seconds(5),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    gcTime: 0,
    staleTime: 0,
    retry: 0,
  })));
