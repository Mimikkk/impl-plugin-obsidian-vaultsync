import { QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";
import { queryClient } from "../clients/QueryClient.ts";

export const withQueryClient = (component: Component) => () => (
  <QueryClientProvider client={queryClient}>{component({})}</QueryClientProvider>
);
