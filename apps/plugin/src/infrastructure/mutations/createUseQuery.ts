import { getQueryClient } from "@plugin/infrastructure/clients/QueryClient.ts";
import type { DefaultError, QueryKey, UseQueryResult } from "@tanstack/solid-query";
import { useQuery } from "@tanstack/solid-query";

export type CreateUseQueryOptions<R = unknown, E = DefaultError, T = R, K extends QueryKey = QueryKey> =
  | Parameters<typeof useQuery<R, E, T, K>>[0]
  | ReturnType<Parameters<typeof useQuery<R, E, T, K>>[0]>;

export type CreateUseQueryResult<R = unknown, E = DefaultError, T = R, K extends QueryKey = QueryKey> = () =>
  UseQueryResult<T, E>;

export const createUseQuery = <R = unknown, E = DefaultError, T = R, K extends QueryKey = QueryKey>(
  options: CreateUseQueryOptions<R, E, T, K>,
): CreateUseQueryResult<R, E, T, K> => {
  const getOptions = typeof options === "object" ? () => options : options;

  return () => useQuery<R, E, T, K>(getOptions, getQueryClient);
};
