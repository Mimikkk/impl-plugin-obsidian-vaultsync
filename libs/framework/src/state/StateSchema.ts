import type { StateField, StateRecord, StateRecordRuntime, StateRecordStorage } from "./StateField.ts";

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
