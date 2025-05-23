import { resolve, singleton } from "@nimir/framework";
import { ChangeType, type FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import type { FileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";
import { RemoteFileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/RemoteFileOperations.ts";
import { LocalFileOperations } from "@plugin/features/synchronization/infrastructure/LocalFileOperations.ts";

@singleton
export class FileChangeManager {
  static create(
    locals = resolve(LocalFileOperations),
    remotes = resolve(RemoteFileOperations),
  ) {
    return new FileChangeManager(locals, remotes);
  }

  private constructor(
    private readonly locals: FileOperations,
    private readonly remotes: FileOperations,
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
    }
  }

  async updateRemote(path: string) {
    const content = await this.locals.download(path);

    return this.remotes.upload(path, content!);
  }

  async removeRemote(path: string) {
    return await this.remotes.delete(path);
  }

  async updateLocal(path: string) {
    const content = await this.remotes.download(path);

    return this.locals.upload(path, content!);
  }

  async removeLocal(path: string) {
    return await this.locals.delete(path);
  }
}
