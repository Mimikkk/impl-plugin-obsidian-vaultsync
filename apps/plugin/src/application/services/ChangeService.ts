import { type ChangeCommand, ChangeType } from "@plugin/application/commands/ChangeCommand.ts";
import { LocalFileSystemClient } from "@plugin/infrastructure/clients/LocalFileSystemClient.ts";
import { RemoteFileSystemClient } from "@plugin/infrastructure/clients/RemoteFileSystemClient.ts";

export namespace ChangeService {
  const locals = LocalFileSystemClient;
  const remotes = RemoteFileSystemClient;

  export async function updates(commands: ChangeCommand[]) {
    return await Promise.all(commands.map(update));
  }

  export async function update(command: ChangeCommand) {
    switch (command.type) {
      case ChangeType.UpdateLocal:
        return await updateLocal(command.path);
      case ChangeType.UpdateRemote:
        return await updateRemote(command.path);
      case ChangeType.RemoveLocal:
        return await removeLocal(command.path);
      case ChangeType.RemoveRemote:
        return await removeRemote(command.path);
    }
  }

  async function updateRemote(path: string) {
    const content = await locals.read(path);

    return remotes.update(path, content!);
  }

  async function removeRemote(path: string) {
    return await remotes.remove(path);
  }

  async function updateLocal(path: string) {
    const content = await remotes.read(path);

    return locals.update(path, content!);
  }

  async function removeLocal(path: string) {
    return await locals.remove(path);
  }
}
