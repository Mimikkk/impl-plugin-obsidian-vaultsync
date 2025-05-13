import { queryClient } from "@plugin/core/infrastructure/clients/internal/QueryClient.ts";
import { QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";

export const withQueryClient = (component: Component) => () => (
  <QueryClientProvider client={queryClient}>{component({})}</QueryClientProvider>
);
