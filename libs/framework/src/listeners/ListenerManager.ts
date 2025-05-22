import type { Awaitable } from "@nimir/shared";

export interface ListenerManager<V> {
  subscribe(listener: ListenerManagerNs.Listener<V>): ListenerManagerNs.Unsubscribe;
  notify(value: V): Awaitable<void>;
}

export namespace ListenerManagerNs {
  export type Listener<V> = (value: V) => Awaitable<void>;
  export type Unsubscribe = () => void;
}
