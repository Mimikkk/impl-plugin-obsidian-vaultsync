import type { ListenerManagerNs } from "@framework/listeners/ListenerManager.ts";

export interface EventManager<EventMap extends Record<string, unknown>> {
  notify<const E extends keyof EventMap>(event: E, value: EventMap[E]): void;

  subscribe<const E extends keyof EventMap>(
    event: E,
    listener: ListenerManagerNs.Listener<EventMap[E]>,
  ): ListenerManagerNs.Unsubscribe;
}
