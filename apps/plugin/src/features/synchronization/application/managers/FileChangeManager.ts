import { resolve, singleton } from "@nimir/framework";
import { ChangeType, type FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import { applyingRemote } from "@plugin/features/synchronization/infrastructure/applyingRemote.ts";
import type { FileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";
import { LocalFileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/LocalFileOperations.ts";
import { RemoteFileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/RemoteFileOperations.ts";
import { BaseHashStore } from "@plugin/features/synchronization/infrastructure/stores/BaseHashStore.ts";

@singleton
export class FileChangeManager {
  static create(
    locals = resolve(LocalFileOperations),
    remotes = resolve(RemoteFileOperations),
    bases = resolve(BaseHashStore),
  ) {
    return new FileChangeManager(locals, remotes, bases);
  }

  private constructor(
    private readonly locals: FileOperations,
    private readonly remotes: FileOperations,
    private readonly bases: BaseHashStore,
  ) {}

  async updates(changes: FileChange[]) {
    return await Promise.all(changes.map((command) => this.update(command)));
  }

  async update(change: FileChange) {
    switch (change.type) {
      case ChangeType.UpdateLocal:
        return await this.updateLocal(change.path);
      case ChangeType.UpdateRemote:
        return await this.updateRemote(change.path);
      case ChangeType.RemoveLocal:
        return await this.removeLocal(change.path);
      case ChangeType.RemoveRemote:
        return await this.removeRemote(change.path);
      case ChangeType.Conflict:
        return;
    }
  }

  async updateRemote(path: string) {
    const content = await this.locals.download(path);
    if (!content) return;
    await this.remotes.upload(path, content);
    await this.bases.record(path, content);
  }

  async removeRemote(path: string) {
    await this.remotes.delete(path);
    this.bases.clear(path);
  }

  async updateLocal(path: string) {
    const content = await this.remotes.download(path);
    if (!content) return;
    await applyingRemote.run(() => this.locals.upload(path, content));
    await this.bases.record(path, content);
  }

  async removeLocal(path: string) {
    await applyingRemote.run(() => this.locals.delete(path));
    this.bases.clear(path);
  }
}
