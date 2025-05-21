import type { Prettify, RecordToObject, RecordToUnion } from "@nimir/shared";
import type { EventManager } from "@plugin/core/infrastructure/listeners/EventManager.ts";
import type { ListenerManagerNs } from "@plugin/core/infrastructure/listeners/ListenerManager.ts";
import { VolatileEventManager } from "@plugin/core/infrastructure/listeners/VolatileEventManager.ts";

export type StateEventMap<T extends Record<string, unknown>> = Prettify<
  { change: RecordToUnion<T> } & RecordToObject<T>
>;

export type StateUpdate<T extends Record<string, unknown>> = { [K in keyof T]: T[K] | ((previous: T[K]) => T[K]) };
export class State<T extends Record<string, unknown> = any> {
  static create<T extends Record<string, unknown>>(
    state: T,
    events: EventManager<StateEventMap<T>> = VolatileEventManager.create<StateEventMap<T>>(),
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
