import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import type { FileHashSource } from "../sources/FileHashSource.ts";

export class FileHashStore {
  static create(source: FileHashSource) {
    return new FileHashStore(source);
  }

  private constructor(
    private readonly source: FileHashSource,
    private readonly store = new Map<string, string>(),
  ) {}

  has(descriptor: FileDescriptor): boolean {
    return this.store.has(this.key(descriptor));
  }

  async get(descriptor: FileDescriptor): Promise<string | undefined> {
    const key = this.key(descriptor);
    let value = this.store.get(key);
    if (value !== undefined) return value;

    value = await this.source.download(descriptor);

    this.store.set(key, value);

    return value;
  }

  private key(descriptor: FileDescriptor): string {
    return descriptor.path + "-" + descriptor.updatedAt;
  }
}
