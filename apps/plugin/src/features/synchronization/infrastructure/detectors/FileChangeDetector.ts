import { DateTimeNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import { RemoteFileSystemClient } from "@plugin/core/infrastructure/clients/external/RemoteFileSystemClient.ts";
import { LocalFileSystemClient } from "@plugin/core/infrastructure/clients/internal/LocalFileSystemClient.ts";
import {
  type ChangeCommand,
  ChangeCommands,
} from "@plugin/features/synchronization/application/commands/ChangeCommand.ts";
import { FileComparator } from "@plugin/features/synchronization/infrastructure/comparators/FileComparator.ts";
import { FileGrouper } from "@plugin/features/synchronization/infrastructure/groupers/FileGrouper.ts";

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

    console.log(commands);

    return commands.flat();
  }

  async function detectLocalOnly(locals: FileDescriptor[]): Promise<ChangeCommand[]> {
    const commands: ChangeCommand[] = [];

    for (const local of locals) {
      const file = await remotes.info(local.path);

      if (file) {
        const wasDeleted = file.deleted;

        if (!wasDeleted) continue;
        const deletedAt = file.modified;
        const isLocalNewer = DateTimeNs.isAfterOrEqual(local.updatedAt, deletedAt);

        if (isLocalNewer) {
          commands.push(ChangeCommands.updateRemote(local.path));
        } else {
          commands.push(ChangeCommands.removeLocal(local.path));
        }
      } else {
        commands.push(ChangeCommands.updateRemote(local.path));
      }
    }

    return commands;
  }

  function detectRemoteOnly(remotes: FileDescriptor[]): ChangeCommand[] {
    const commands: ChangeCommand[] = [];

    for (const remote of remotes) {
      const info = locals.info(remote.path);

      if (info) {
        const deletedAt = info.deletedAt;
        const isRemoteNewer = DateTimeNs.isAfterOrEqual(remote.updatedAt, deletedAt);

        if (isRemoteNewer) {
          commands.push(ChangeCommands.updateLocal(remote.path));
        } else {
          commands.push(ChangeCommands.removeRemote(remote.path));
        }
      } else {
        commands.push(ChangeCommands.updateLocal(remote.path));
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

      const isLocalNewer = DateTimeNs.isAfterOrEqual(local.updatedAt, remote.updatedAt);
      if (isLocalNewer) {
        commands.push(ChangeCommands.updateRemote(local.path));
      } else {
        commands.push(ChangeCommands.updateLocal(local.path));
      }
    }

    return commands;
  }
}
