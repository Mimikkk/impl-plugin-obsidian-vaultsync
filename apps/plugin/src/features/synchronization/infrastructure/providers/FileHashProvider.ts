import { resolve, singleton } from "@nimir/framework";
import { type FileDescriptor, FileType } from "@plugin/core/domain/types/FileDescriptor.ts";
import {
  LocalFileHashProvider,
  RemoteFileHashProvider,
} from "@plugin/features/synchronization/infrastructure/providers/FileHashStoreProvider.ts";
import type { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";

@singleton
export class FileHashProvider {
  static create(
    locals = resolve(LocalFileHashProvider),
    remotes = resolve(RemoteFileHashProvider),
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
