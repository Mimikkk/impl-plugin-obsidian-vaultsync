import { resolve, singleton } from "@nimir/framework";
import type { FileHashStore } from "@plugin/features/synchronization/infrastructure/stores/FileHashStore.ts";
import { type FileInfo, FileType } from "../../../../core/domain/types/FileTypes.ts";
import { LocalFileHashStore, RemoteFileHashStore } from "../stores/FileHashStores.ts";

@singleton
export class FileHashProvider {
  static create(
    locals = resolve(LocalFileHashStore),
    remotes = resolve(RemoteFileHashStore),
  ) {
    return new FileHashProvider(locals, remotes);
  }

  private constructor(
    private readonly locals: FileHashStore,
    private readonly remotes: FileHashStore,
  ) {}

  get(descriptor: FileInfo): Promise<string> {
    if (descriptor.type === FileType.Local) {
      return this.locals.get(descriptor);
    }

    return this.remotes.get(descriptor);
  }
}
