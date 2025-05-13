import type { State } from "@plugin/features/state/domain/entities/State.ts";
import { Manager, type ManagerUpdate } from "@plugin/features/state/infrastructure/Manager.ts";

export class StateProvider {
  static instance: StateProvider;

  private constructor(private readonly manager: Manager) {}

  private static create(manager: Manager = Manager.create()) {
    return new StateProvider(manager);
  }

  static from(manager: Manager): StateProvider {
    if (!StateProvider.instance) {
      StateProvider.instance = StateProvider.create(manager);
    }

    return StateProvider.instance;
  }

  get(): State {
    return this.manager.get();
  }

  async update(callback: ManagerUpdate): Promise<void> {
    await this.manager.update(callback);
  }
}
