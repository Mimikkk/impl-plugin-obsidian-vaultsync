export class ValueState<T> {
  static create<T>(value: T | null = null) {
    return new ValueState<T>(value);
  }

  private constructor(
    private value: T | null,
  ) {}

  static from<T, I extends ValueState<T> = ValueState<T>>(
    item: ValueState<T>,
    into: I = ValueState.create<T>() as I,
  ): I {
    return into.from(item);
  }

  static fromParameters<T, I extends ValueState<T> = ValueState<T>>(
    value: T | null,
    into: I = ValueState.create<T>() as I,
  ): I {
    return into.fromParameters(value);
  }

  from(item: ValueState<T>): this {
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
