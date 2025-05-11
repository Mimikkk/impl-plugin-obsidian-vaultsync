export class LastSyncTs {
  static instance = LastSyncTs.create();

  static create(value: number | null = null) {
    return new LastSyncTs(value);
  }

  private constructor(public ts: number | null) {}

  from(value: number | null): this {
    return this.set(value);
  }

  set(value: number | null): this {
    this.ts = value;
    return this;
  }

  clear(): this {
    this.ts = null;
    return this;
  }

  now(): this {
    this.ts = Date.now();
    return this;
  }
}
