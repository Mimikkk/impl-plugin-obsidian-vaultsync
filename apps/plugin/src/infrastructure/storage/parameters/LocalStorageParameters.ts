import type { LocalStorageParameterNs } from "@plugin/infrastructure/storage/parameters/LocalStorageParameter.ts";

export namespace LocalStorageParameters {
  export const number = (initial: number): LocalStorageParameterNs.Options<number> => ({
    serializer: (value: number) => value.toString(),
    deserializer: (value: string | null) => +(value ?? initial),
  });
}
