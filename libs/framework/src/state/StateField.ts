import type { StrRecord } from "@nimir/shared";

export type StateRecord = StrRecord<StateField>;

export type StateRecordStorage<R extends StateRecord> = {
  [K in keyof R]: R[K] extends StateField<any, infer T> ? T : never;
};

export type StateRecordRuntime<R extends StateRecord> = {
  [K in keyof R]: R[K] extends StateField<infer T, any> ? T : never;
};

export interface StateFieldOptions<Runtime, Storage> {
  validate: (value: unknown) => value is Storage;
  encode: (value: Storage) => Runtime;
  decode: (value: Runtime, into?: Storage) => Storage;
  fallback: () => Runtime;
}

export class StateField<Runtime = any, Storage = any> {
  static create<Runtime, Storage>(
    { fallback, decode, encode, validate }: StateFieldOptions<Runtime, Storage>,
  ) {
    return new StateField(validate, encode, decode, fallback);
  }

  private constructor(
    public readonly validate: (value: unknown) => value is Storage,
    public readonly encode: (value: Storage) => Runtime,
    public readonly decode: (value: Runtime, into?: Storage) => Storage,
    public readonly fallback: () => Runtime,
  ) {}
}

export namespace StateFields {
  export interface NumberOptions extends StateFieldOptions<number, number> {
  }

  const numberOptions: NumberOptions = {
    fallback: () => 0,
    validate: (value): value is number => typeof value === "number",
    encode: (value: number) => value,
    decode: (value: number) => value,
  };

  export const number = (options?: Partial<NumberOptions>) =>
    StateField.create<number, number>({
      fallback: options?.fallback ?? numberOptions.fallback,
      validate: options?.validate ?? numberOptions.validate,
      encode: options?.encode ?? numberOptions.encode,
      decode: options?.decode ?? numberOptions.decode,
    });

  export interface MapOptions<K = any, V = any> extends StateFieldOptions<Map<K, V>, [key: K, value: V][]> {
  }

  const mapOptions: MapOptions = {
    fallback: () => new Map(),
    validate: (value): value is [unknown, unknown][] =>
      Array.isArray(value) && value.every((item) => Array.isArray(item) && item.length === 2),
    encode: (value) => new Map(value),
    decode: (value) => Array.from(value.entries()),
  };

  export const map = <K, V>(options?: Partial<MapOptions<K, V>>) =>
    StateField.create<Map<K, V>, [K, V][]>({
      fallback: options?.fallback ?? mapOptions.fallback,
      validate: options?.validate ?? mapOptions.validate,
      encode: options?.encode ?? mapOptions.encode,
      decode: options?.decode ?? mapOptions.decode,
    });
}
