import { QueryClientNs } from "@interaction/configurations/QueryClient.ts";
import type {
  DefaultError,
  SolidMutationOptions,
  UseMutateAsyncFunction,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/solid-query";
import { useMutation } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";
import { isAnyMutating } from "./isAnyMutating.ts";

export type CreateUseMutationOptions<T = unknown, E = DefaultError, V = void, C = unknown> =
  | UseMutationOptions<T, E, V, C>
  | SolidMutationOptions<T, E, V, C>;

export type CreateUseMutationResult<T, E, V, C> = {
  mutate: UseMutateAsyncFunction<T, E, V, C>;
  mutation: UseMutationResult<T, E, V, C>;
  isMutating: Accessor<boolean>;
} & [
  mutate: UseMutateAsyncFunction<T, E, V, C>,
  mutation: UseMutationResult<T, E, V, C>,
  isMutating: Accessor<boolean>,
];

export const createUseMutation = <T = unknown, E = DefaultError, V = void, C = unknown>(
  options: CreateUseMutationOptions<T, E, V, C>,
) => {
  const getOptions = typeof options === "object" ? () => options : options;

  return (): CreateUseMutationResult<T, E, V, C> => {
    const mutation = useMutation(getOptions, QueryClientNs.get);
    const isMutating = isAnyMutating(getOptions);

    const result = [mutation.mutateAsync, mutation, isMutating] as CreateUseMutationResult<T, E, V, C>;
    result.mutate = mutation.mutateAsync;
    result.mutation = mutation;
    result.isMutating = isMutating;

    return result;
  };
};
