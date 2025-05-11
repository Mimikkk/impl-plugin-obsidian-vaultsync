import { useQuery } from "@tanstack/solid-query";
import { Status } from "../../infrastructure/types/Status.ts";

export const useLastEventId = () =>
  Status.accessQuery(useQuery(() => ({
    queryKey: ["last-event-id"],
    queryFn: async () => {
      // await SyncService.scan();

      // const [event] = await SyncService.events({ since: 0, limit: 1 });

      // if (event) {
      //   Memory.lastSeenEventId.set(event.id - 1);
      // }

      return "OK";
    },
    refetchOnReconnect: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
  })));
