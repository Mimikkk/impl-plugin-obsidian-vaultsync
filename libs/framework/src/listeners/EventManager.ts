import type { ListenerManagerNs } from "@framework/listeners/ListenerManager.ts";
import type { StrRecord } from "@nimir/shared";

export interface EventManager<EventMap extends StrRecord> {
  notify<const E extends keyof EventMap>(event: E, value: EventMap[E]): void;

  subscribe<const E extends keyof EventMap>(
    event: E,
    listener: ListenerManagerNs.Listener<EventMap[E]>,
  ): ListenerManagerNs.Unsubscribe;
}
