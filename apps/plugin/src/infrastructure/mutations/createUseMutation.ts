import { getQueryClient } from "@plugin/infrastructure/clients/QueryClient.ts";
import { isAnyMutating } from "@plugin/infrastructure/mutations/isAnyMutating.ts";
import type {
  DefaultError,
  SolidMutationOptions,
  UseMutateAsyncFunction,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/solid-query";
import { useMutation } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

export type CreateUseMutationResult<T, E, V, C> = [
  mutate: UseMutateAsyncFunction<T, E, V, C>,
  mutation: UseMutationResult<T, E, V, C>,
  isMutating: Accessor<boolean>,
] & {
  mutate: UseMutateAsyncFunction<T, E, V, C>;
  mutation: UseMutationResult<T, E, V, C>;
  isMutating: Accessor<boolean>;
};

export const createUseMutation = <T = unknown, E = DefaultError, V = void, C = unknown>(
  options: UseMutationOptions<T, E, V, C> | SolidMutationOptions<T, E, V, C>,
) => {
  const getOptions = typeof options === "object" ? () => options : options;

  return (): CreateUseMutationResult<T, E, V, C> => {
    const mutation = useMutation(getOptions, getQueryClient);
    const isMutating = isAnyMutating(getOptions);

    const result = [mutation.mutateAsync, mutation, isMutating] as CreateUseMutationResult<T, E, V, C>;
    result.mutate = mutation.mutateAsync;
    result.mutation = mutation;
    result.isMutating = isMutating;

    return result;
  };
};
