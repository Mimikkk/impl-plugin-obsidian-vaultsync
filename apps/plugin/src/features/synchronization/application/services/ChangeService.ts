import { RemoteFileSystemClient } from "@plugin/core/infrastructure/clients/external/RemoteFileSystemClient.ts";
import { LocalFileSystemClient } from "@plugin/core/infrastructure/clients/internal/LocalFileSystemClient.ts";
import { type ChangeCommand, ChangeType } from "@plugin/features/synchronization/application/commands/ChangeCommand.ts";

export class ChangeService {
  static create(
    locals: LocalFileSystemClient = LocalFileSystemClient.create(),
    remotes: RemoteFileSystemClient = RemoteFileSystemClient.create(),
  ) {
    return new ChangeService(locals, remotes);
  }

  private constructor(
    private readonly locals: LocalFileSystemClient,
    private readonly remotes: RemoteFileSystemClient,
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
