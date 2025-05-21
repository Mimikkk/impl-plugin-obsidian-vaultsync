import {
  StateField,
  type StateFieldOptions,
  type StateRecord,
  type StateRecordRuntime,
  type StateRecordStorage,
} from "@plugin/features/state/infrastructure/StateField.ts";

export class StateSchema<T extends StateRecord = any> {
  static create<T extends StateRecord>(state: Map<keyof T, T[keyof T]>) {
    return new StateSchema(state);
  }

  private constructor(
    private readonly map: Map<keyof T, T[keyof T]>,
  ) {}

  get<K extends keyof T>(key: K): T[K] {
    return this.map.get(key) as T[K];
  }

  validate<K extends keyof T>(key: unknown, value: unknown): value is T[K] {
    return (this.map.get(key as K) as StateField | undefined)?.validate(value) ?? false;
  }

  entries(): IterableIterator<[keyof T, T[keyof T]]> {
    return this.map.entries();
  }
}
export type StateStorage<R extends StateSchema = StateSchema> = R extends StateSchema<infer T> ? StateRecordStorage<T>
  : never;

export type StateRuntime<R extends StateSchema = StateSchema> = R extends StateSchema<infer T> ? StateRecordRuntime<T>
  : never;

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
