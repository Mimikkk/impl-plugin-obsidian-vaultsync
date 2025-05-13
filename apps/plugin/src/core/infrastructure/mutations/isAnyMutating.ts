import { getQueryClient } from "@plugin/core/infrastructure/clients/internal/QueryClient.ts";
import type { MutationFilters } from "@tanstack/solid-query";
import { useIsMutating } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

export const isAnyMutating = (filters?: Accessor<MutationFilters>): Accessor<boolean> => () =>
  !!useIsMutating(filters, getQueryClient)();
