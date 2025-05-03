import { useQuery } from "@tanstack/solid-query";
import { type Accessor, createMemo } from "solid-js";
import { Status } from "../../shared/types/Status.ts";
import { TimeMs } from "../../shared/values/timeMs.ts";
import { HealthService } from "../services/HealthService.ts";

const key = ["health"];
export const useHealthStatus = (): Accessor<Status> => {
  const result = useQuery(() => ({
    queryKey: key,
    queryFn: HealthService.check,
    staleTime: TimeMs.m5,
    refetchInterval: TimeMs.m5,
    retry: 0,
  }));

  return createMemo(() => Status.fromQuery(result));
};
