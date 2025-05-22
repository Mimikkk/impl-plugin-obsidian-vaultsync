import type { ListenerManager, ListenerManagerNs } from "./ListenerManager.ts";

export class VolatileListenerManager<V> implements ListenerManager<V> {
  static create<V>(
    listeners: ListenerManagerNs.Listener<V>[] = [],
  ): VolatileListenerManager<V> {
    return new VolatileListenerManager<V>(listeners);
  }

  private constructor(
    public readonly listeners: ListenerManagerNs.Listener<V>[],
  ) {}

  async notify(value: V): Promise<void> {
    for (let i = 0; i < this.listeners.length; ++i) {
      await this.listeners[i](value);
    }
  }

  subscribe(listener: ListenerManagerNs.Listener<V>): ListenerManagerNs.Unsubscribe {
    this.listeners.push(listener);

    return () => this.listeners.splice(this.listeners.indexOf(listener), 1);
  }
}
