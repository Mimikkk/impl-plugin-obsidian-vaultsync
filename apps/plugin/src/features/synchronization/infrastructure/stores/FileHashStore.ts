import type { ListenerManager, ListenerManagerNs } from "@nimir/framework";
import { VolatileListenerManager } from "@nimir/framework";
import { BufferNs } from "@nimir/shared";
import type { FileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";
import type { FileInfo } from "../../../../core/domain/types/FileTypes.ts";

type ChangeValue = { key: string; value: string };
export class FileHashStore {
  static create(
    operations: FileOperations,
    store: Map<string, string> = new Map(),
    listeners = VolatileListenerManager.create<ChangeValue>(),
  ) {
    return new FileHashStore(operations, store, listeners);
  }

  private constructor(
    private readonly operations: FileOperations,
    private readonly store: Map<string, string>,
    private readonly listeners: ListenerManager<ChangeValue>,
  ) {}

  has(descriptor: FileInfo): boolean {
    return this.store.has(this.key(descriptor));
  }

  async get(descriptor: FileInfo): Promise<string> {
    const key = this.key(descriptor);
    let value = this.store.get(key);
    if (value !== undefined) return value;

    const buffer = await this.operations.download(descriptor.path);
    value = BufferNs.toString(buffer!);

    this.store.set(key, value);
    this.listeners.notify({ key, value });

    return value;
  }

  private key(descriptor: FileInfo): string {
    return descriptor.path + "-" + descriptor.updatedAt;
  }

  subscribe(listener: ListenerManagerNs.Listener<ChangeValue>): ListenerManagerNs.Unsubscribe {
    return this.listeners.subscribe(listener);
  }
}
