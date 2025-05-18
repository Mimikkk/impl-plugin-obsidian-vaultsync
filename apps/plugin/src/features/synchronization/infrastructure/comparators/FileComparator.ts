import { DateTimeNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import { FileHashProvider } from "@plugin/features/synchronization/infrastructure/providers/FileHashProvider.ts";

export class FileComparator {
  static create(hashes: FileHashProvider = FileHashProvider.create()) {
    return new FileComparator(hashes);
  }

  private constructor(
    private readonly hashes: FileHashProvider,
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
      this.hashes.get(a),
      this.hashes.get(b),
    ]);

    return localHash === remoteHash;
  }
}
