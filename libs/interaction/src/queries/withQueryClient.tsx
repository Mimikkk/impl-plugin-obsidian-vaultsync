import { QueryClientNs } from "@interaction/configurations/QueryClient.ts";
import { type QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";

export const withQueryClient = (component: Component, client: QueryClient = QueryClientNs.get()) => () => (
  <QueryClientProvider client={client}>{component({})}</QueryClientProvider>
);
