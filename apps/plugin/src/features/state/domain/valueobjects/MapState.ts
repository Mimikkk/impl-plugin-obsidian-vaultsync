export class MapState<K, V> {
  static create<K, V>(value: Map<K, V> = new Map()) {
    return new MapState<K, V>(value);
  }

  private constructor(
    private value: Map<K, V>,
  ) {}

  static from<K, V, I extends MapState<K, V> = MapState<K, V>>(
    item: MapState<K, V>,
    into: I = MapState.create<K, V>() as I,
  ): I {
    return into.from(item);
  }

  static fromParameters<K, V, I extends MapState<K, V> = MapState<K, V>>(
    map: Map<K, V>,
    into: I = MapState.create<K, V>() as I,
  ): I {
    return into.fromParameters(map);
  }

  from(item: MapState<K, V>): this {
    return this.set(item.value);
  }

  fromParameters(map: Map<K, V>): this {
    return this.set(map);
  }

  set(map: Map<K, V>): this {
    this.value = new Map(map);
    return this;
  }

  get(): Map<K, V> {
    return this.value;
  }

  add(key: K, value: V): this {
    this.value.set(key, value);
    return this;
  }

  clear(): this {
    this.value = new Map();
    return this;
  }
}
