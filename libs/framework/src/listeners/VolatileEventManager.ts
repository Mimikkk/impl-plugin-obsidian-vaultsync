import { register } from "@framework/dependencies/decorators.ts";
import type { ListenerManager, ListenerManagerNs } from "@framework/listeners/ListenerManager.ts";
import type { Awaitable, StrRecord } from "@nimir/shared";
import type { EventManager } from "./EventManager.ts";
import { VolatileListenerManager } from "./VolatileListenerManager.ts";

@register
export class VolatileEventManager<EventMap extends StrRecord> implements EventManager<EventMap> {
  static create<EventMap extends StrRecord>(
    listeners: Map<keyof EventMap, VolatileListenerManager<EventMap[keyof EventMap]>> = new Map(),
  ): VolatileEventManager<EventMap> {
    return new VolatileEventManager(listeners);
  }

  private constructor(
    private readonly listeners: Map<keyof EventMap, ListenerManager<EventMap[keyof EventMap]>>,
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
    let registry = this.listeners.get(event) as ListenerManager<EventMap[E]> | undefined;

    if (registry === undefined) {
      registry = VolatileListenerManager.create();
      this.listeners.set(event, registry as never);
    }

    return registry.subscribe(listener);
  }
}
