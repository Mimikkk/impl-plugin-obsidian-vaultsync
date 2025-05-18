import { DateTimeNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import { FileHashStoreProvider } from "../providers/FileHashStoreProvider.ts";
import type { FileHashStore } from "../stores/FileHashStore.ts";

export class FileComparator {
  static create(locals?: FileHashStore, remotes?: FileHashStore) {
    if (!locals || !remotes) {
      const state = FileHashStoreProvider.create();
      locals ??= state.local();
      remotes ??= state.remote();
    }

    return new FileComparator(locals, remotes);
  }

  private constructor(
    private readonly locals: FileHashStore,
    private readonly remotes: FileHashStore,
  ) {}

  async compare(a: FileDescriptor, b: FileDescriptor): Promise<boolean> {
    if (this.areTimestampsSimilar(a, b)) return true;
    return await this.areHashesEqual(a, b);
  }

  areTimestampsSimilar(a: FileDescriptor, b: FileDescriptor): boolean {
    return DateTimeNs.within(a.updatedAt, b.updatedAt, 1000);
  }

  async areHashesEqual(a: FileDescriptor, b: FileDescriptor): Promise<boolean> {
    const [localHash, remoteHash] = await Promise.all([
      this.locals.get(a),
      this.remotes.get(b),
    ]);

    return localHash === remoteHash;
  }
}
