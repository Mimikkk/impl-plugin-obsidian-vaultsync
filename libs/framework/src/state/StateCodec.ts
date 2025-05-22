import type { StrRecord } from "@nimir/shared";
import type { StateRuntime, StateSchema, StateStorage } from "./StateSchema.ts";

export class StateCodec<T extends StateSchema = any> {
  static create<T extends StateSchema>(schema: T) {
    return new StateCodec(schema);
  }

  constructor(private readonly schema: T) {}

  validate(data: unknown): data is StateRuntime<T> {
    if (typeof data !== "object" || data === null) {
      return false;
    }

    for (const [key, field] of this.schema.entries()) {
      if (!field.validate((data as StrRecord)[key as string])) {
        return false;
      }
    }

    return true;
  }

  initial(): StateRuntime<T> {
    const encoded = new Map<keyof T, T[keyof T]>();

    for (const [key, field] of this.schema.entries()) {
      encoded.set(key as keyof T, field.fallback());
    }

    return Object.fromEntries(encoded) as StateRuntime<T>;
  }

  decode(encoded: StateRuntime<T>): StateStorage<T> {
    const decoded = new Map<keyof T, T[keyof T]>();

    for (const [key, field] of this.schema.entries()) {
      decoded.set(key as keyof T, field.decode(encoded[key as keyof T]));
    }

    return Object.fromEntries(decoded) as StateStorage<T>;
  }

  encode(decoded: StateStorage<T>): StateRuntime<T> {
    const encoded = new Map<keyof T, T[keyof T]>();

    for (const [key, field] of this.schema.entries()) {
      encoded.set(key as keyof T, field.encode(decoded[key as keyof T]));
    }

    return Object.fromEntries(encoded) as StateRuntime<T>;
  }
}
