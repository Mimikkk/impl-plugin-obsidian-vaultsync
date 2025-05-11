export class DeletedFiles {
  static instance = DeletedFiles.create();

  static create(value: Map<string, number> = new Map()) {
    return new DeletedFiles(value);
  }

  private constructor(public paths: Map<string, number>) {}

  from(value: Map<string, number>): this {
    this.clear();

    for (const [path, timestamp] of value) {
      this.add(path, timestamp);
    }

    return this;
  }

  get(path: string): number | undefined {
    return this.paths.get(path);
  }

  has(path: string): boolean {
    return this.paths.has(path);
  }

  add(path: string, timestamp: number): this {
    this.paths.set(path, timestamp);
    return this;
  }

  remove(path: string): this {
    this.paths.delete(path);
    return this;
  }

  clear(): this {
    this.paths.clear();
    return this;
  }
}
