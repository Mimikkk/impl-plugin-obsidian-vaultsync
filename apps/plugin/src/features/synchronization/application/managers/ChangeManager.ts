import { ChangeType, type FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import { LocalFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/LocalFilesystemProvider.ts";
import { RemoteFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/RemoteFilesystemProvider.ts";

export class ChangeManager {
  static create(
    locals: LocalFilesystemProvider = LocalFilesystemProvider.create(),
    remotes: RemoteFilesystemProvider = RemoteFilesystemProvider.create(),
  ) {
    return new ChangeManager(locals, remotes);
  }

  private constructor(
    private readonly locals: LocalFilesystemProvider,
    private readonly remotes: RemoteFilesystemProvider,
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
    const content = await this.locals.read(path);

    return this.remotes.update(path, content!);
  }

  async removeRemote(path: string) {
    return await this.remotes.remove(path);
  }

  async updateLocal(path: string) {
    const content = await this.remotes.read(path);

    return this.locals.update(path, content!);
  }

  async removeLocal(path: string) {
    return await this.locals.remove(path);
  }
}
