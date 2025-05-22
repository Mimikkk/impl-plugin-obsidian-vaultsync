import type { ListenerManager, ListenerManagerNs } from "@nimir/framework";
import { VolatileListenerManager } from "@nimir/framework";
import { BufferNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import type { FilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/FilesystemProvider.ts";

type ChangeValue = { key: string; value: string };
export class FileHashStore {
  static create(
    filesystem: FilesystemProvider,
    store: Map<string, string> = new Map(),
    listeners: ListenerManager<ChangeValue> = VolatileListenerManager.create<ChangeValue>(),
  ) {
    return new FileHashStore(filesystem, store, listeners);
  }

  private constructor(
    private readonly filesystem: FilesystemProvider,
    private readonly store: Map<string, string>,
    private readonly listeners: ListenerManager<ChangeValue>,
  ) {}

  has(descriptor: FileDescriptor): boolean {
    return this.store.has(this.key(descriptor));
  }

  async get(descriptor: FileDescriptor): Promise<string> {
    const key = this.key(descriptor);
    let value = this.store.get(key);
    if (value !== undefined) return value;

    const buffer = await this.filesystem.read(descriptor.path);
    value = BufferNs.toString(buffer!);

    this.store.set(key, value);
    this.listeners.notify({ key, value });

    return value;
  }

  private key(descriptor: FileDescriptor): string {
    return descriptor.path + "-" + descriptor.updatedAt;
  }

  subscribe(listener: ListenerManagerNs.Listener<ChangeValue>): ListenerManagerNs.Unsubscribe {
    return this.listeners.subscribe(listener);
  }
}
