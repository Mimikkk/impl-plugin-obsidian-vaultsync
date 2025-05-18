import type { Prettify } from "@nimir/shared";
import type { EventManager } from "@plugin/core/infrastructure/listeners/EventManager.ts";
import type { ListenerManagerNs } from "@plugin/core/infrastructure/listeners/ListenerManager.ts";
import { VolatileEventManager } from "@plugin/core/infrastructure/listeners/VolatileEventManager.ts";
import type { RecordToObject, RecordToUnion } from "../../../../../libs/shared/src/types/common.ts";

type StateRecord = Record<never, StateDefinition>;

type StateDecodedRecord<R extends StateRecord> = {
  [K in keyof R]: R[K] extends StateDefinition<any, infer Decoded> ? Decoded : never;
};

type StateEncodedRecord<R extends StateRecord> = {
  [K in keyof R]: R[K] extends StateDefinition<infer Encoded, any> ? Encoded : never;
};

export class StateRegistryBuilder<T extends StateRecord = any> {
  static create() {
    return new StateRegistryBuilder<StateRecord>(new Map());
  }

  private constructor(
    private readonly map: Map<unknown, unknown>,
  ) {}

  with<K extends string, S extends StateDefinition>(key: K, value: S): StateRegistryBuilder<T & { [key in K]: S }> {
    this.map.set(key, value);
    return this as unknown as StateRegistryBuilder<T & { [key in K]: S }>;
  }

  build(): StateRegistry<Prettify<T>> {
    return StateRegistry.create(this.map as unknown as Map<keyof T, T[keyof T]>);
  }
}

export class StateRegistry<T extends StateRecord = any> {
  static create<T extends StateRecord>(state: Map<keyof T, T[keyof T]>) {
    return new StateRegistry(state);
  }

  private constructor(
    private readonly map: Map<keyof T, T[keyof T]>,
  ) {}

  get<K extends keyof T>(key: K): T[K] {
    return this.map.get(key) as T[K];
  }

  entries(): IterableIterator<[keyof T, T[keyof T]]> {
    return this.map.entries();
  }
}

type StateRegistryDecoded<R extends StateRegistry<any>> = R extends StateRegistry<infer T> ? StateDecodedRecord<T>
  : never;
type StateRegistryEncoded<R extends StateRegistry<any>> = R extends StateRegistry<infer T> ? StateEncodedRecord<T>
  : never;

interface StateDefinitionOptions<Encoded, Decoded> {
  validate: (value: unknown) => value is Decoded;
  encode: (value: Decoded) => Encoded;
  decode: (value: Encoded, into?: Decoded) => Decoded;
  fallback: () => Encoded;
}

class StateDefinition<Encoded = any, Decoded = any> {
  static create<Encoded, Decoded>(
    { fallback, decode, encode, validate }: StateDefinitionOptions<Encoded, Decoded>,
  ) {
    return new StateDefinition(validate, encode, decode, fallback);
  }

  private constructor(
    public readonly validate: (value: unknown) => value is Decoded,
    public readonly encode: (value: Decoded) => Encoded,
    public readonly decode: (value: Encoded, into?: Decoded) => Decoded,
    public readonly fallback: () => Encoded,
  ) {}
}

export namespace StateDefinitions {
  export interface NumberOptions extends StateDefinitionOptions<number, number> {
  }

  const numberOptions: NumberOptions = {
    fallback: () => 0,
    validate: (value): value is number => typeof value === "number",
    encode: (value: number) => value,
    decode: (value: number) => value,
  };

  export const number = (options?: Partial<NumberOptions>) =>
    StateDefinition.create<number, number>({
      fallback: options?.fallback ?? numberOptions.fallback,
      validate: options?.validate ?? numberOptions.validate,
      encode: options?.encode ?? numberOptions.encode,
      decode: options?.decode ?? numberOptions.decode,
    });

  export interface MapOptions<K = any, V = any> extends StateDefinitionOptions<Map<K, V>, [key: K, value: V][]> {
  }

  const mapOptions: MapOptions = {
    fallback: () => new Map(),
    validate: (value): value is [unknown, unknown][] =>
      Array.isArray(value) && value.every((item) => Array.isArray(item) && item.length === 2),
    encode: (value) => new Map(value),
    decode: (value) => Array.from(value.entries()),
  };

  export const map = <K, V>(options?: Partial<MapOptions<K, V>>) =>
    StateDefinition.create<Map<K, V>, [K, V][]>({
      fallback: options?.fallback ?? mapOptions.fallback,
      validate: options?.validate ?? mapOptions.validate,
      encode: options?.encode ?? mapOptions.encode,
      decode: options?.decode ?? mapOptions.decode,
    });
}

const SyncStateRegistry = StateRegistryBuilder
  .create()
  .with("lastSyncTs", StateDefinitions.number())
  .with("deletedFiles", StateDefinitions.map<string, string>())
  .with("localFilesHashes", StateDefinitions.map<string, string>())
  .with("remoteFilesHashes", StateDefinitions.map<string, string>())
  .build();

type SyncState = StateRegistryDecoded<typeof SyncStateRegistry>;
type SyncStateEncoded = StateRegistryEncoded<typeof SyncStateRegistry>;

class StateEncoder<T extends StateRegistry = any> {
  static create<T extends StateRegistry>(registry: T) {
    return new StateEncoder(registry);
  }

  constructor(public readonly registry: T) {}

  validate(data: unknown): data is StateRegistryEncoded<T> {
    if (typeof data !== "object" || data === null) {
      return false;
    }

    for (const [key, value] of this.registry.entries()) {
      if (!value.validate((data as Record<string, unknown>)[key as string])) {
        return false;
      }
    }

    return true;
  }

  decode(encoded: StateRegistryEncoded<T>): StateRegistryDecoded<T> {
    const decoded = new Map<keyof T, T[keyof T]>();

    for (const [key, value] of this.registry.entries()) {
      decoded.set(key as keyof T, value.decode(encoded[key as keyof T]));
    }

    return Object.fromEntries(decoded) as StateRegistryDecoded<T>;
  }

  encode(decoded: StateRegistryDecoded<T>): StateRegistryEncoded<T> {
    const encoded = new Map<keyof T, T[keyof T]>();

    for (const [key, value] of this.registry.entries()) {
      encoded.set(key as keyof T, value.encode(decoded[key as keyof T]));
    }

    return Object.fromEntries(encoded) as StateRegistryEncoded<T>;
  }
}

const s = StateEncoder.create(SyncStateRegistry);
const e = s.encode({ lastSyncTs: 1, deletedFiles: [], localFilesHashes: [], remoteFilesHashes: [] });
const d = s.decode(e);

type StateManagerEventMap<T extends Record<string, unknown>> = Prettify<
  { change: RecordToUnion<T> } & RecordToObject<T>
>;

class StateManager<T extends Record<string, unknown>> {
  static create<T extends Record<string, unknown>>(
    state: T,
    events: EventManager<StateManagerEventMap<T>>,
  ) {
    return new StateManager(state, events);
  }

  constructor(
    public readonly state: T,
    private readonly events: EventManager<StateManagerEventMap<T>>,
  ) {}

  get<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.state[key] = value;

    this.events.notify(key, value);
    this.events.notify("change", { key, value });
  }

  subscribe(
    key: Parameters<typeof this.events["subscribe"]>[0],
    listener: Parameters<typeof this.events["subscribe"]>[1],
  ): ListenerManagerNs.Unsubscribe {
    return this.events.subscribe(key, listener);
  }
}

StateManager.create({ a: 1, b: "asd" }, VolatileEventManager.create()).subscribe("change", ({ key, value }) => {
  if (key === "a") {
    console.log(value);
  }

  if (key === "b") {
    console.log(value);
  }
});
