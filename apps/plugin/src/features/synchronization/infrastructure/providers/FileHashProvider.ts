import { di } from "@nimir/framework";
import { type FileDescriptor, FileType } from "@plugin/core/domain/types/FileDescriptor.ts";
import {
  TLocalFileHashProvider,
  TRemoteFileHashProvider,
} from "@plugin/features/synchronization/infrastructure/providers/FileHashStoreProvider.ts";
import type { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";

export class FileHashProvider {
  static create(
    locals = di.of(TLocalFileHashProvider),
    remotes = di.of(TRemoteFileHashProvider),
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

export const TFileHashProvider = di.singleton(FileHashProvider);
