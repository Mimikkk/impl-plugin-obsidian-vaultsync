import type { Awaitable } from "@nimir/shared";
import type { ListenerManager, ListenerManagerNs } from "../../../core/infrastructure/listeners/ListenerManager.ts";
import { VolatileListenerManager } from "../../../core/infrastructure/listeners/VolatileListenerManager.ts";
import { SyncState } from "../domain/entities/SyncState.ts";

export interface StateManagerUpdate {
  (state: SyncState): Awaitable<void>;
}

export class StateManager {
  static instance = StateManager.create();

  static create(
    state: SyncState = SyncState.create(),
    listeners: ListenerManager<SyncState> = VolatileListenerManager.create(),
  ) {
    return new StateManager(state, listeners);
  }

  private constructor(
    private readonly state: SyncState,
    private readonly listeners: ListenerManager<SyncState>,
  ) {}

  async update(callback: StateManagerUpdate): Promise<void> {
    await callback(this.state);
    this.listeners.notify(this.state);
  }

  get(): SyncState {
    return this.state;
  }

  subscribe(callback: ListenerManagerNs.Listener<SyncState>): ListenerManagerNs.Unsubscribe {
    return this.listeners.subscribe(callback);
  }
}
