import { getQueryClient } from "@plugin/core/infrastructure/clients/internal/QueryClient.ts";
import type { DefaultError, QueryKey, UndefinedInitialDataOptions, UseQueryResult } from "@tanstack/solid-query";
import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

type QueryOptions<R = unknown, E = DefaultError, T = R, K extends QueryKey = QueryKey> = ReturnType<
  UndefinedInitialDataOptions<R, E, T, K>
>;

export type CreateUseQueryOptions<R = unknown, E = DefaultError, T = R, K extends QueryKey = QueryKey> =
  | Accessor<QueryOptions<R, E, T, K>>
  | QueryOptions<R, E, T, K>;

export type CreateUseQueryResult<R = unknown, E = DefaultError, T = R, K extends QueryKey = QueryKey> = (
  options?: Partial<QueryOptions<R, E, T, K>>,
) => UseQueryResult<T, E>;

export const createUseQuery = <R = unknown, E = DefaultError, T = R, K extends QueryKey = QueryKey>(
  options: CreateUseQueryOptions<R, E, T, K>,
): CreateUseQueryResult<R, E, T, K> => {
  const getOptions = typeof options === "object" ? () => options : options;
  const extendedOptions = (options?: Partial<QueryOptions<R, E, T, K>>) =>
    options ? ({ ...getOptions(), ...options }) : getOptions();

  return (options) => useQuery<R, E, T, K>(() => extendedOptions(options), getQueryClient);
};
