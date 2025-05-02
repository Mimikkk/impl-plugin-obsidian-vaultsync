import { QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";
import { queryClient } from "../values/queryClient.ts";

export const withQueryClient = (component: Component) => () => (
  <QueryClientProvider client={queryClient}>{component({})}</QueryClientProvider>
);
