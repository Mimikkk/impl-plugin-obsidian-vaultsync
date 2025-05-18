import { type FileDescriptor, FileType } from "@plugin/core/domain/types/FileDescriptor.ts";
import { FileHashStoreProvider } from "@plugin/features/synchronization/infrastructure/providers/FileHashStoreProvider.ts";
import type { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";

export class FileHashProvider {
  static create(
    locals: FileHashStore = FileHashStoreProvider.create().local(),
    remotes: FileHashStore = FileHashStoreProvider.create().remote(),
  ) {
    return new FileHashProvider(locals, remotes);
  }

  private constructor(
    private readonly locals: FileHashStore,
    private readonly remotes: FileHashStore,
  ) {}

  get(descriptor: FileDescriptor): Promise<string> {
    if (descriptor.type === FileType.Local) {
      return this.locals.get(descriptor);
    }

    return this.remotes.get(descriptor);
  }
}
