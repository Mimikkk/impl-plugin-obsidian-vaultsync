import { type ChangeCommand, ChangeType } from "@plugin/features/synchronization/application/commands/ChangeCommand.ts";
import { LocalFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/LocalFilesystemProvider.ts";
import { RemoteFilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/RemoteFilesystemProvider.ts";

export class ChangeService {
  static create(
    locals: LocalFilesystemProvider = LocalFilesystemProvider.create(),
    remotes: RemoteFilesystemProvider = RemoteFilesystemProvider.create(),
  ) {
    return new ChangeService(locals, remotes);
  }

  private constructor(
    private readonly locals: LocalFilesystemProvider,
    private readonly remotes: RemoteFilesystemProvider,
  ) {}

  async updates(commands: ChangeCommand[]) {
    return await Promise.all(commands.map((command) => this.update(command)));
  }

  async update(command: ChangeCommand) {
    switch (command.type) {
      case ChangeType.UpdateLocal:
        return await this.updateLocal(command.path);
      case ChangeType.UpdateRemote:
        return await this.updateRemote(command.path);
      case ChangeType.RemoveLocal:
        return await this.removeLocal(command.path);
      case ChangeType.RemoveRemote:
        return await this.removeRemote(command.path);
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
