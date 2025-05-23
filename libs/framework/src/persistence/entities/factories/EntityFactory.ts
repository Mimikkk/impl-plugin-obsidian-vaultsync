import type { Entity } from "../Entity.ts";

export interface EntityFactory<E extends Entity> {
  create(value: E["value"]): E;
}
