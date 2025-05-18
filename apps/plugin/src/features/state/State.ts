import type { Prettify } from "@nimir/shared";

type StateRecord = Record<never, State>;

export class StateBuilder<T extends StateRecord> {
  static create() {
    return new StateBuilder<StateRecord>(new Map());
  }

  private constructor(
    private readonly map: Map<unknown, unknown>,
  ) {}

  with<K extends string, S extends State>(key: K, value: S): StateBuilder<T & { [key in K]: S }> {
    this.map.set(key, value);
    return this as unknown as StateBuilder<T & { [key in K]: S }>;
  }

  build(): StateRegistry<Prettify<T>> {
    return StateRegistry.create(this.map as unknown as Map<keyof T, T[keyof T]>);
  }
}

export class StateRegistry<T extends StateRecord> {
  static create<T extends StateRecord>(state: Map<keyof T, T[keyof T]>) {
    return new StateRegistry(state);
  }

  private constructor(
    private readonly map: Map<keyof T, T[keyof T]>,
  ) {}

  get<K extends keyof T>(key: K): T[K] {
    return this.map.get(key) as T[K];
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.map.set(key, value);
  }

  entries(): IterableIterator<[keyof T, T[keyof T]]> {
    return this.map.entries();
  }
}

interface StateOptions<Encoded, Decoded> {
  validate: (value: unknown) => value is Decoded;
  encode: (value: Decoded) => Encoded;
  decode: (value: Encoded, into?: Decoded) => Decoded;
  fallback: () => Encoded;
}

class State<Encoded = any, Decoded = any> {
  static create<Encoded, Decoded>(
    { fallback, decode, encode, validate }: StateOptions<Encoded, Decoded>,
  ) {
    return new State(validate, encode, decode, fallback);
  }

  private constructor(
    public readonly validate: (value: unknown) => value is Decoded,
    public readonly encode: (value: Decoded) => Encoded,
    public readonly decode: (value: Encoded, into?: Decoded) => Decoded,
    public readonly fallback: () => Encoded,
  ) {}
}

export namespace StateValues {
  export interface NumberOptions extends StateOptions<number, number> {
  }

  const numberOptions: NumberOptions = {
    fallback: () => 0,
    validate: (value): value is number => typeof value === "number",
    encode: (value: number) => value,
    decode: (value: number) => value,
  };

  export const number = (options?: Partial<NumberOptions>) =>
    State.create<number, number>({
      fallback: options?.fallback ?? numberOptions.fallback,
      validate: options?.validate ?? numberOptions.validate,
      encode: options?.encode ?? numberOptions.encode,
      decode: options?.decode ?? numberOptions.decode,
    });

  export interface MapOptions<K = any, V = any> extends StateOptions<Map<K, V>, [K, V][]> {
  }

  const mapOptions: MapOptions = {
    fallback: () => new Map(),
    validate: (value): value is [unknown, unknown][] =>
      Array.isArray(value) && value.every((item) => Array.isArray(item) && item.length === 2),
    encode: (value) => new Map(value),
    decode: (value) => Array.from(value.entries()),
  };

  export const map = <K, V>(options?: Partial<MapOptions<K, V>>) =>
    State.create<Map<K, V>, [K, V][]>({
      fallback: options?.fallback ?? mapOptions.fallback,
      validate: options?.validate ?? mapOptions.validate,
      encode: options?.encode ?? mapOptions.encode,
      decode: options?.decode ?? mapOptions.decode,
    });
}

const SyncRegistry = StateBuilder
  .create()
  .with("lastSyncTs", StateValues.number())
  .with("deletedFiles", StateValues.map<string, string>())
  .with("localFilesHashes", StateValues.map<string, string>())
  .with("remoteFilesHashes", StateValues.map<string, string>())
  .build();
