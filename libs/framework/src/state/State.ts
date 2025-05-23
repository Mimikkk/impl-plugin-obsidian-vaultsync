import type { EventManager } from "@framework/listeners/EventManager.ts";
import type { ListenerManagerNs } from "@framework/listeners/ListenerManager.ts";
import { VolatileEventManager } from "@framework/listeners/VolatileEventManager.ts";
import { resolve } from "@framework/mod.ts";
import type { Prettify, RecordToObject, RecordToUnion, StrRecord } from "@nimir/shared";

export type StateEventMap<T extends StrRecord> = Prettify<
  { change: RecordToUnion<T> } & RecordToObject<T>
>;

export type StateUpdate<T extends StrRecord> = { [K in keyof T]: T[K] | ((previous: T[K]) => T[K]) };

export class State<T extends StrRecord = StrRecord> {
  static create<T extends StrRecord>(
    state: T,
    events = resolve<VolatileEventManager<StateEventMap<T>>>(VolatileEventManager),
  ) {
    return new State(state, events);
  }

  constructor(
    public readonly content: T,
    private readonly events: EventManager<StateEventMap<T>>,
  ) {}

  get<const K extends keyof T>(key: K): T[K] {
    return this.content[key];
  }

  set<const K extends keyof T>(key: K, value: T[K] | ((value: T[K]) => T[K])): void {
    const next = value instanceof Function ? value(this.content[key]) : value;
    this.content[key] = next;

    const message = { key, value: next } as never;
    this.events.notify(key, message);
    this.events.notify("change", message);
  }

  update(updates: Partial<StateUpdate<T>>): void {
    for (const key in updates) {
      const update = updates[key];
      this.set(key, update!);
    }
  }

  subscribe<const K extends keyof StateEventMap<T>>(
    key: K,
    listener: ListenerManagerNs.Listener<StateEventMap<T>[K]>,
  ): ListenerManagerNs.Unsubscribe {
    return this.events.subscribe(key, listener);
  }
}
