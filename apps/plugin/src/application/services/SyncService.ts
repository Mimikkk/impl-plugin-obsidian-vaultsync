import { DateTimeNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import { SyncEventClient } from "@plugin/infrastructure/clients/SyncEventClient.ts";
import { LocalFileSystemClient } from "../../infrastructure/clients/LocalFileSystemClient.ts";
import { RemoteFileSystemClient } from "../../infrastructure/clients/RemoteFileSystemClient.ts";
import { ChangeService } from "./ChangeService.ts";
import { FileService } from "./FileService.ts";

export namespace SyncService {
  const events = SyncEventClient;
  const remotes = RemoteFileSystemClient;
  const locals = LocalFileSystemClient;
  const files = FileService;
  const changer = ChangeService;

  export async function sync() {
    console.log("Synchronizing...");

    await events.scan();

    const { both, localOnly, remoteOnly } = await files.byLocation();
    const commands = await Promise.all([syncConflicts(both), syncLocalOnly(localOnly), syncRemoteOnly(remoteOnly)]);

    await changer.updates(commands.flat());

    console.log("Synchronized.");
    return "OK";
  }

  async function syncLocalOnly(descriptors: FileDescriptor[]): Promise<ChangeService.ChangeCommand[]> {
    const commands: ChangeService.ChangeCommand[] = [];

    for (const descriptor of descriptors) {
      const file = await remotes.info(descriptor.path);

      if (file) {
        const wasDeleted = file.deleted;

        if (!wasDeleted) continue;
        const deletedAt = file.modified;
        const isLocalNewer = DateTimeNs.isAfterOrEqual(descriptor.updatedAt, deletedAt);

        if (isLocalNewer) {
          commands.push(ChangeService.ChangeCommands.updateRemote(descriptor.path));
        } else {
          commands.push(ChangeService.ChangeCommands.removeLocal(descriptor.path));
        }
      } else {
        commands.push(ChangeService.ChangeCommands.updateRemote(descriptor.path));
      }
    }

    return commands;
  }

  function syncRemoteOnly(descriptors: FileDescriptor[]): ChangeService.ChangeCommand[] {
    const commands: ChangeService.ChangeCommand[] = [];

    for (const descriptor of descriptors) {
      const info = locals.info(descriptor.path);

      if (info) {
        const deletedAt = info.deletedAt;
        const isRemoteNewer = DateTimeNs.isAfterOrEqual(descriptor.updatedAt, deletedAt);

        if (isRemoteNewer) {
          commands.push(ChangeService.ChangeCommands.updateLocal(descriptor.path));
        } else {
          commands.push(ChangeService.ChangeCommands.removeRemote(descriptor.path));
        }
      } else {
        commands.push(ChangeService.ChangeCommands.updateLocal(descriptor.path));
      }
    }

    return commands;
  }

  async function syncConflicts(
    conflicts: { local: FileDescriptor; remote: FileDescriptor }[],
  ): Promise<ChangeService.ChangeCommand[]> {
    const commands: ChangeService.ChangeCommand[] = [];

    for (const { local, remote } of conflicts) {
      const isUpToDate = await files.areFilesEqual(local, remote);
      if (isUpToDate) continue;

      const isRemoteNewer = DateTimeNs.isAfterOrEqual(local.updatedAt, remote.updatedAt);
      if (isRemoteNewer) {
        commands.push(ChangeService.ChangeCommands.updateLocal(local.path));
      } else {
        commands.push(ChangeService.ChangeCommands.updateRemote(local.path));
      }
    }

    return commands;
  }
}
