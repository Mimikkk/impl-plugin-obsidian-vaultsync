import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import { ClientState } from "@plugin/features/ui/presentation/state/ClientState.ts";
import type { FileHashSource } from "../sources/FileHashSource.ts";

export class FileHashStore {
  static create(source: FileHashSource, store: Map<string, string> = new Map()) {
    return new FileHashStore(source, store);
  }

  private constructor(
    private readonly source: FileHashSource,
    private readonly store: Map<string, string>,
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
    ClientState.save();

    return value;
  }

  private key(descriptor: FileDescriptor): string {
    return descriptor.path + "-" + descriptor.updatedAt;
  }
}
