import type { Awaitable } from "@nimir/shared";
import type { ListenerManagerNs } from "@plugin/core/infrastructure/listeners/ListenerManager.ts";
import type { EventManager } from "./EventManager.ts";
import { VolatileListenerManager } from "./VolatileListenerManager.ts";

export class VolatileEventManager<EventMap extends Record<string, unknown>> implements EventManager<EventMap> {
  static create<EventMap extends Record<string, unknown>>(
    listeners: Map<keyof EventMap, VolatileListenerManager<EventMap[keyof EventMap]>> = new Map(),
  ): VolatileEventManager<EventMap> {
    return new VolatileEventManager(listeners);
  }

  private constructor(
    private readonly listeners: Map<keyof EventMap, VolatileListenerManager<EventMap[keyof EventMap]>>,
  ) {}

  notify<const E extends keyof EventMap>(event: E, value: EventMap[E]): Awaitable<void> {
    const listener = this.listeners.get(event);

    if (listener === undefined) {
      return;
    }

    return listener.notify(value);
  }

  subscribe<const E extends keyof EventMap>(
    event: E,
    listener: ListenerManagerNs.Listener<EventMap[E]>,
  ): ListenerManagerNs.Unsubscribe {
    let registry = this.listeners.get(event) as VolatileListenerManager<EventMap[E]> | undefined;

    if (registry === undefined) {
      registry = VolatileListenerManager.create();
      this.listeners.set(event, registry as never);
    }

    return registry.subscribe(listener);
  }
}
