import { resolve, singleton } from "@nimir/framework";
import type { FileInfo } from "@nimir/shared";
import { DateTimeNs, TimeMs } from "@nimir/shared";
import { FileHashProvider } from "@plugin/features/synchronization/infrastructure/providers/FileHashProvider.ts";

@singleton
export class FileComparator {
  static create(hashes = resolve(FileHashProvider)) {
    return new FileComparator(hashes);
  }

  private constructor(
    private readonly hashes: FileHashProvider,
  ) {}

  async compare(a: FileInfo, b: FileInfo): Promise<boolean> {
    if (this.areTimestampsSimilar(a, b)) return true;
    return await this.areHashesEqual(a, b);
  }

  areTimestampsSimilar(a: FileInfo, b: FileInfo): boolean {
    return DateTimeNs.within(a.updatedAt, b.updatedAt, TimeMs.s1);
  }

  async areHashesEqual(a: FileInfo, b: FileInfo): Promise<boolean> {
    const [local, remote] = await Promise.all([
      this.hashes.get(a),
      this.hashes.get(b),
    ]);

    return local === remote;
  }
}
