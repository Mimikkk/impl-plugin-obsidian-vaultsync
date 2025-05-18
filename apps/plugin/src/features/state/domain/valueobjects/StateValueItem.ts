export class StateValueItem<T> {
  static create<T>(value: T | null = null) {
    return new StateValueItem<T>(value);
  }

  private constructor(
    private value: T | null,
  ) {}

  static from<T, I extends StateValueItem<T> = StateValueItem<T>>(
    item: StateValueItem<T>,
    into: I = StateValueItem.create<T>() as I,
  ): I {
    return into.from(item);
  }

  static fromParameters<T, I extends StateValueItem<T> = StateValueItem<T>>(
    value: T | null,
    into: I = StateValueItem.create<T>() as I,
  ): I {
    return into.fromParameters(value);
  }

  from(item: StateValueItem<T>): this {
    return this.set(item.value);
  }

  fromParameters(value: T | null): this {
    return this.set(value);
  }

  get(): T | null {
    return this.value;
  }

  set(value: T | null): this {
    this.value = value;
    return this;
  }

  clear(): this {
    this.value = null;
    return this;
  }
}
