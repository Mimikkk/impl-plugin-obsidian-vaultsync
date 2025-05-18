import type { State } from "@plugin/features/state/domain/entities/State.ts";
import { StateManager, type StateManagerUpdate } from "./StateManager.ts";

export class StateProvider {
  static instance: StateProvider;

  private constructor(private readonly manager: StateManager) {}

  private static create(manager: StateManager = StateManager.create()) {
    return new StateProvider(manager);
  }

  static from(manager: StateManager): StateProvider {
    if (!StateProvider.instance) {
      StateProvider.instance = StateProvider.create(manager);
    }

    return StateProvider.instance;
  }

  get(): State {
    return this.manager.get();
  }

  async update(callback: StateManagerUpdate): Promise<void> {
    await this.manager.update(callback);
  }
}
