import type { Awaitable } from "@nimir/shared";
import type { ListenerRegistry } from "@plugin/core/infrastructure/listeners/ListenerRegistry.ts";
import { VolatileListenerRegistry } from "@plugin/core/infrastructure/listeners/VolatileListenerRegistry.ts";
import { State } from "../domain/entities/State.ts";

export interface StateManagerUpdate {
  (state: State): Awaitable<void>;
}

export class StateManager {
  static instance = StateManager.create();

  static create(
    state: State = State.create(),
    listeners: ListenerRegistry<State> = VolatileListenerRegistry.create(),
  ) {
    return new StateManager(state, listeners);
  }

  private constructor(
    private readonly state: State,
    private readonly listeners: ListenerRegistry<State>,
  ) {}

  async update(callback: StateManagerUpdate): Promise<void> {
    await callback(this.state);
    this.listeners.notify(this.state);
  }

  get(): State {
    return this.state;
  }

  subscribe(callback: ListenerRegistry.Listener<State>): ListenerRegistry.Unsubscribe {
    return this.listeners.subscribe(callback);
  }
}
