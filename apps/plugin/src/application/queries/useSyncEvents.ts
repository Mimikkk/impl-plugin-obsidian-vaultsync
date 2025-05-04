import { SyncService } from "@plugin/application/services/SyncService.ts";
import { Memory } from "@plugin/domain/storage/Memory.ts";
import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";
import { Status } from "../../shared/types/Status.ts";
import { TimeMs } from "../../shared/values/timeMs.ts";

export const useSyncEvents = (options?: { enabled?: Accessor<boolean> }) =>
  Status.accessQuery(useQuery(() => ({
    queryKey: ["sync-events"],
    queryFn: async () => {
      await SyncService.scan();

      const lastSeenId = Memory.lastSeenEventId.get();

      const events = await SyncService.events({ events: ["LocalIndexUpdated"], since: lastSeenId });

      const last = events[events.length - 1];
      if (last) {
        Memory.lastSeenEventId.set(last.id);
      }

      return events;
    },
    refetchInterval: TimeMs.seconds(5),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 0,
    enabled: options?.enabled,
  })));
