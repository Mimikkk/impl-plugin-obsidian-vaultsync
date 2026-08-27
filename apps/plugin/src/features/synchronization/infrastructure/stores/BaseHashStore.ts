import { resolve, singleton } from "@nimir/framework";
import { FileHasher } from "@plugin/features/synchronization/infrastructure/hashes/FileHasher.ts";
import {
  type ISyncState,
  SyncState,
} from "@plugin/features/synchronization/infrastructure/SyncState.ts";
import { LocalFileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/LocalFileOperations.ts";

@singleton
export class BaseHashStore {
  static create(
    state = resolve(SyncState),
    hasher = resolve(FileHasher),
    locals = resolve(LocalFileOperations),
  ) {
    return new BaseHashStore(state, hasher, locals);
  }

  private constructor(
    private readonly state: ISyncState,
    private readonly hasher: FileHasher,
    private readonly locals: LocalFileOperations,
  ) {}

  get(path: string): string | undefined {
    return this.state.get("baseHashes").get(path);
  }

  async record(path: string, content?: ArrayBuffer) {
    const buffer = content ?? (await this.locals.download(path));
    if (!buffer) {
      this.clear(path);
      return;
    }
    const hash = await this.hasher.hash(buffer);
    this.state.set("baseHashes", (previous) => {
      previous.set(path, hash);
      return previous;
    });
  }

  clear(path: string) {
    this.state.set("baseHashes", (previous) => {
      previous.delete(path);
      return previous;
    });
  }
}
