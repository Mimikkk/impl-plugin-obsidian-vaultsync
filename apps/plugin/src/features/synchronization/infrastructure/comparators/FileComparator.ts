import { DateTimeNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import type { FileHashStore } from "../stores/FileHashStore.ts";
import { FileHashStoreWithState } from "../stores/FileHashStoreWithState.ts";

export class FileComparator {
  static create(
    locals: FileHashStore = FileHashStoreWithState.local(),
    remotes: FileHashStore = FileHashStoreWithState.remote(),
  ) {
    return new FileComparator(locals, remotes);
  }

  private constructor(
    private readonly locals: FileHashStore,
    private readonly remotes: FileHashStore,
  ) {}

  async compare(local: FileDescriptor, remote: FileDescriptor): Promise<boolean> {
    if (this.areTimestampsSimilar(local, remote)) return true;
    return await this.areHashesEqual(local, remote);
  }

  areTimestampsSimilar(local: FileDescriptor, remote: FileDescriptor): boolean {
    return DateTimeNs.within(local.updatedAt, remote.updatedAt, 1000);
  }

  async areHashesEqual(local: FileDescriptor, remote: FileDescriptor): Promise<boolean> {
    const [localHash, remoteHash] = await Promise.all([
      this.locals.get(local),
      this.remotes.get(remote),
    ]);

    return localHash === remoteHash;
  }
}
