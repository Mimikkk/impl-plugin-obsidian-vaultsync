import type { Prettify } from "@nimir/shared";
import type { StateField, StateRecord } from "../../../core/infrastructure/state/StateField.ts";
import { StateSchema } from "../../../core/infrastructure/state/StateSchema.ts";

export class StateSchemaBuilder<T extends StateRecord = StateRecord> {
  static create() {
    return new StateSchemaBuilder<StateRecord>(new Map());
  }

  private constructor(
    private readonly map: Map<unknown, unknown>,
  ) {}

  with<K extends string, S extends StateField>(key: K, value: S): StateSchemaBuilder<T & { [key in K]: S }> {
    this.map.set(key, value);
    return this as unknown as StateSchemaBuilder<T & { [key in K]: S }>;
  }

  build(): StateSchema<Prettify<T>> {
    return StateSchema.create(this.map as unknown as Map<keyof T, T[keyof T]>);
  }
}
