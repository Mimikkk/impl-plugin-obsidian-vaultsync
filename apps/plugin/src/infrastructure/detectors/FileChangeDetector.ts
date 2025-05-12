import { type ChangeCommand, ChangeCommands } from "@plugin/application/commands/ChangeCommand.ts";
import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import { LocalFileSystemClient } from "@plugin/infrastructure/clients/LocalFileSystemClient.ts";
import { RemoteFileSystemClient } from "@plugin/infrastructure/clients/RemoteFileSystemClient.ts";
import { FileComparator } from "@plugin/infrastructure/comparators/FileComparator.ts";
import { FileGrouper } from "@plugin/infrastructure/groupers/FileGrouper.ts";
import { DateTimeNs } from "../../../../../libs/shared/src/utils/DateTimeStr.ts";

export namespace FileChangeDetector {
  const remotes = RemoteFileSystemClient;
  const locals = LocalFileSystemClient;
  const comparator = FileComparator;
  const grouper = FileGrouper;

  export async function detect(): Promise<ChangeCommand[]> {
    const { both, localOnly, remoteOnly } = await grouper.byLocation();

    const commands = await Promise.all([
      detectConflicts(both),
      detectLocalOnly(localOnly),
      detectRemoteOnly(remoteOnly),
    ]);

    return commands.flat();
  }

  async function detectLocalOnly(descriptors: FileDescriptor[]): Promise<ChangeCommand[]> {
    const commands: ChangeCommand[] = [];

    for (const descriptor of descriptors) {
      const file = await remotes.info(descriptor.path);

      if (file) {
        const wasDeleted = file.deleted;

        if (!wasDeleted) continue;
        const deletedAt = file.modified;
        const isLocalNewer = DateTimeNs.isAfterOrEqual(descriptor.updatedAt, deletedAt);

        if (isLocalNewer) {
          commands.push(ChangeCommands.updateRemote(descriptor.path));
        } else {
          commands.push(ChangeCommands.removeLocal(descriptor.path));
        }
      } else {
        commands.push(ChangeCommands.updateRemote(descriptor.path));
      }
    }

    return commands;
  }

  function detectRemoteOnly(descriptors: FileDescriptor[]): ChangeCommand[] {
    const commands: ChangeCommand[] = [];

    for (const descriptor of descriptors) {
      const info = locals.info(descriptor.path);

      if (info) {
        const deletedAt = info.deletedAt;
        const isRemoteNewer = DateTimeNs.isAfterOrEqual(descriptor.updatedAt, deletedAt);

        if (isRemoteNewer) {
          commands.push(ChangeCommands.updateLocal(descriptor.path));
        } else {
          commands.push(ChangeCommands.removeRemote(descriptor.path));
        }
      } else {
        commands.push(ChangeCommands.updateLocal(descriptor.path));
      }
    }

    return commands;
  }

  async function detectConflicts(
    conflicts: { local: FileDescriptor; remote: FileDescriptor }[],
  ): Promise<ChangeCommand[]> {
    const commands: ChangeCommand[] = [];

    for (const { local, remote } of conflicts) {
      const isUpToDate = await comparator.compare(local, remote);
      if (isUpToDate) continue;

      const isRemoteNewer = DateTimeNs.isAfterOrEqual(local.updatedAt, remote.updatedAt);
      if (isRemoteNewer) {
        commands.push(ChangeCommands.updateLocal(local.path));
      } else {
        commands.push(ChangeCommands.updateRemote(local.path));
      }
    }

    return commands;
  }
}
