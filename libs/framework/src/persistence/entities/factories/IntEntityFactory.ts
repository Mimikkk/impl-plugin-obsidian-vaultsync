import type { IdentifierGenerator } from "../../identifiers/IdentifierGenerator.ts";
import type { Entity } from "../Entity.ts";
import { IntEntity } from "../IntEntity.ts";
import type { EntityFactory } from "./EntityFactory.ts";

export class IntEntityFactory<E extends Entity<number, any>> implements EntityFactory<E> {
  static create<E extends Entity<number, any>>(
    identifiers: IdentifierGenerator<number>,
  ): IntEntityFactory<E> {
    return new IntEntityFactory<E>(identifiers);
  }

  private constructor(
    private readonly identifiers: IdentifierGenerator<number>,
  ) {}

  create(value: E["value"]): E {
    return IntEntity.create(this.identifiers.generate(), value) as E;
  }
}
