import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import type { ListenerRegistry } from "@plugin/core/infrastructure/listeners/ListenerRegistry.ts";
import { VolatileListenerRegistry } from "@plugin/core/infrastructure/listeners/VolatileListenerRegistry.ts";
import type { FileHashSource } from "../sources/FileHashSource.ts";

type ChangeValue = { key: string; value: string };
export class FileHashStore {
  static create(
    source: FileHashSource,
    store: Map<string, string> = new Map(),
    listeners: ListenerRegistry<ChangeValue> = VolatileListenerRegistry.create<ChangeValue>(),
  ) {
    return new FileHashStore(source, store, listeners);
  }

  private constructor(
    private readonly source: FileHashSource,
    private readonly store: Map<string, string>,
    private readonly listeners: ListenerRegistry<ChangeValue>,
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
    this.listeners.notify({ key, value });

    return value;
  }

  private key(descriptor: FileDescriptor): string {
    return descriptor.path + "-" + descriptor.updatedAt;
  }

  subscribe(listener: ListenerRegistry.Listener<ChangeValue>): ListenerRegistry.Unsubscribe {
    return this.listeners.subscribe(listener);
  }
}
