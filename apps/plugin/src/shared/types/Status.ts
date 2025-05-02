import type { UseQueryResult } from "@tanstack/solid-query";

export enum Status {
  Idle = "idle",
  Loading = "loading",
  Error = "error",
  Success = "success",
}

export namespace Status {
  export const fromQuery = (query: UseQueryResult): Status => {
    if (query.isPending) {
      return Status.Loading;
    }

    if (query.isError) {
      return Status.Error;
    }

    if (query.isSuccess) {
      return Status.Success;
    }

    return Status.Idle;
  };
}
