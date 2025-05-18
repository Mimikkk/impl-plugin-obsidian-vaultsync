import type { Awaitable } from "@nimir/shared";
import type { ListenerRegistry } from "@plugin/core/infrastructure/listeners/ListenerRegistry.ts";
import { VolatileListenerRegistry } from "@plugin/core/infrastructure/listeners/VolatileListenerRegistry.ts";
import { SyncState } from "../domain/entities/SyncState.ts";

export interface StateManagerUpdate {
  (state: SyncState): Awaitable<void>;
}

export class StateManager {
  static instance = StateManager.create();

  static create(
    state: SyncState = SyncState.create(),
    listeners: ListenerRegistry<SyncState> = VolatileListenerRegistry.create(),
  ) {
    return new StateManager(state, listeners);
  }

  private constructor(
    private readonly state: SyncState,
    private readonly listeners: ListenerRegistry<SyncState>,
  ) {}

  async update(callback: StateManagerUpdate): Promise<void> {
    await callback(this.state);
    this.listeners.notify(this.state);
  }

  get(): SyncState {
    return this.state;
  }

  subscribe(callback: ListenerRegistry.Listener<SyncState>): ListenerRegistry.Unsubscribe {
    return this.listeners.subscribe(callback);
  }
}
