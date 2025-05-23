import { singleton, type Store, VolatileStore } from "@nimir/framework";
import type { Controller, ControllerClass } from "@server/core/infrastructure/routing/controllers/ControllerTypes.ts";

@singleton
export class ControllerStore {
  static create(
    store = VolatileStore.create<ControllerClass, Controller>(),
  ): ControllerStore {
    return new ControllerStore(store);
  }

  private constructor(
    private readonly controllers: Store<ControllerClass, Controller>,
  ) {}

  get<C extends ControllerClass>(key: C): Controller<C> {
    let instance = this.controllers.find(key);

    if (instance === undefined) {
      instance = key.create() as Controller<C>;
      this.controllers.set(key, instance);
    }

    return instance;
  }

  keys(): IterableIterator<ControllerClass> {
    return this.controllers.keys();
  }

  values(): IterableIterator<Controller> {
    return this.controllers.values();
  }
}
