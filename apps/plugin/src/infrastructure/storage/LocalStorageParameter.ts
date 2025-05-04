import { LocalStorage } from "@plugin/infrastructure/storage/LocalStorage.ts";

export class LocalStorageParameter<T> {
  static create<T>(name: string, { serializer, deserializer }: LocalStorageParameterNs.Options<T>) {
    return new LocalStorageParameter(name, serializer, deserializer);
  }

  private constructor(
    public readonly name: string,
    public readonly serializer: (value: T) => string,
    public readonly deserializer: (value: string | null) => T,
  ) {}

  static get<T>(
    name: string,
    deserializer: LocalStorageParameterNs.Deserializer<T> = LocalStorageParameterNs.deserializer,
  ) {
    return deserializer(localStorage.getItem(name));
  }

  static set<T>(
    name: string,
    value: T,
    serializer: LocalStorageParameterNs.Serializer<T> = LocalStorageParameterNs.serializer,
  ) {
    localStorage.setItem(name, serializer(value));
  }

  set(value: T) {
    LocalStorage.set(this.name, value, this.serializer);
  }

  get() {
    return LocalStorage.get(this.name, this.deserializer);
  }
}

export namespace LocalStorageParameterNs {
  export type Serializer<T> = (value: T) => string;
  export type Deserializer<T> = (value: string | null) => T;

  export interface Options<T> {
    serializer: Serializer<T>;
    deserializer: Deserializer<T>;
  }

  export const serializer = <T>(value: T) => value as string;
  export const deserializer = <T>(value: string | null) => value as T;
}
