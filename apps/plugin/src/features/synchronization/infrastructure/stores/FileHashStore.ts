import type { ListenerManager, ListenerManagerNs } from "@nimir/framework";
import { resolve, VolatileListenerManager } from "@nimir/framework";
import type { FileInfo } from "@nimir/shared";
import type { FileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";
import { FileHasher } from "../hashes/FileHasher.ts";

type ChangeValue = { key: string; value: string };
export class FileHashStore {
  static create(
    operations: FileOperations,
    store: Map<string, string> = new Map(),
    listeners = VolatileListenerManager.create<ChangeValue>(),
    hasher = resolve(FileHasher),
  ) {
    return new FileHashStore(operations, store, listeners, hasher);
  }

  private constructor(
    private readonly operations: FileOperations,
    private readonly store: Map<string, string>,
    private readonly listeners: ListenerManager<ChangeValue>,
    private readonly hasher: FileHasher,
  ) {}

  has(descriptor: FileInfo): boolean {
    return this.store.has(this.key(descriptor));
  }

  async get(descriptor: FileInfo): Promise<string> {
    const key = this.key(descriptor);
    let value = this.store.get(key);
    if (value !== undefined) return value;

    const buffer = await this.operations.download(descriptor.path);
    value = await this.hasher.hash(buffer!);

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
