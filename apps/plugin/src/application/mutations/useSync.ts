import { useMutation } from "@tanstack/solid-query";
import { HealthService } from "../services/HealthService.ts";

const key = ["sync"];
export const useSync = () =>
  useMutation(() => ({
    mutationFn: HealthService.check,
    mutationKey: key,
  }));
