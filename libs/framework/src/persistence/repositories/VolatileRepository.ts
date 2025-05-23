import type { Entity } from "../entities/Entity.ts";
import type { EntityFactory } from "../entities/factories/EntityFactory.ts";
import { VolatileStore } from "../stores/VolatileStore.ts";
import type { Repository } from "./Repository.ts";

export class VolatileRepository<E extends Entity> implements Repository<E> {
  static create<E extends Entity>(
    entities: EntityFactory<E>,
    store = VolatileStore.create<E["id"], E>(),
  ): VolatileRepository<E> {
    return new VolatileRepository(entities, store);
  }

  private constructor(
    private readonly factory: EntityFactory<E>,
    private readonly store: VolatileStore<E["id"], E>,
  ) {}

  delete(id: E["id"]): boolean {
    return this.store.delete(id);
  }

  has(id: E["id"]): boolean {
    return this.store.has(id);
  }

  find(id: E["id"]): E | undefined {
    return this.store.find(id);
  }

  keys(): IterableIterator<E["id"]> {
    return this.store.keys();
  }

  values(): IterableIterator<E> {
    return this.store.values();
  }

  persist(value: E["value"]): E {
    const entity = this.factory.create(value);

    this.store.set(entity.id, entity);

    return entity;
  }

  remove(id: E["id"]): boolean {
    return this.store.delete(id);
  }
}
