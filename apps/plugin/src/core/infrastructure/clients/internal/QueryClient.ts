import { QueryClient } from "@tanstack/solid-query";

export const queryClient = new QueryClient();
export const getQueryClient = () => queryClient;

export const cleanupQueryClient = async () => {
  await queryClient.cancelQueries();
  queryClient.clear();
  queryClient.unmount();
};
