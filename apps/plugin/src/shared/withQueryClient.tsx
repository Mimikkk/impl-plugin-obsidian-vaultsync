import { QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";
import { queryClient } from "./queryClient.ts";

export const withQueryClient = (component: Component) => () => (
  <QueryClientProvider client={queryClient}>{component({})}</QueryClientProvider>
);
