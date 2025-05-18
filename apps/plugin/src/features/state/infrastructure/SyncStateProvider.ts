import type { SyncState } from "@plugin/features/state/domain/entities/SyncState.ts";
import { StateManager, type StateManagerUpdate } from "./SyncStateManager.ts";

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

  get(): SyncState {
    return this.manager.get();
  }

  async update(callback: StateManagerUpdate): Promise<void> {
    await this.manager.update(callback);
  }
}
