import { DateTimeNs } from "@nimir/shared";
import { type FileDescriptor, FileType } from "@plugin/core/domain/types/FileDescriptor.ts";
import { type FileChange, FileChanges } from "../../domain/FileChange.ts";
import { FileComparator } from "@plugin/features/synchronization/infrastructure/comparators/FileComparator.ts";
import { FileProvider } from "@plugin/features/synchronization/infrastructure/providers/FileProvider.ts";

export class FileChangeDetector {
  static create(
    files: FileProvider = FileProvider.create(),
    comparator: FileComparator = FileComparator.create(),
  ) {
    return new FileChangeDetector(files, comparator);
  }

  private constructor(
    private readonly files: FileProvider,
    private readonly comparator: FileComparator,
  ) {}

  async detect(): Promise<FileChange[]> {
    const { both, localOnly, remoteOnly } = await this.files.byLocation();

    const changes = await Promise.all([
      this.detectConflicts(both),
      this.detectLocalOnly(localOnly),
      this.detectRemoteOnly(remoteOnly),
    ]);

    return changes.flat();
  }

  async detectLocalOnly(locals: FileDescriptor[]): Promise<FileChange[]> {
    const commands: FileChange[] = [];

    for (const local of locals) {
      const info = await this.files.info({
        path: local.path,
        updatedAt: undefined!,
        type: FileType.Remote,
      });

      if (info) {
        const wasDeleted = info.deleted;

        if (!wasDeleted) continue;
        const deletedAt = info.deletedAt;
        const isLocalNewer = DateTimeNs.isAfterOrEqual(local.updatedAt, deletedAt);

        if (isLocalNewer) {
          commands.push(FileChanges.updateRemote(local.path));
        } else {
          commands.push(FileChanges.removeLocal(local.path));
        }
      } else {
        commands.push(FileChanges.updateRemote(local.path));
      }
    }

    return commands;
  }

  async detectRemoteOnly(remotes: FileDescriptor[]): Promise<FileChange[]> {
    const commands: FileChange[] = [];

    for (const remote of remotes) {
      const info = await this.files.info({
        path: remote.path,
        updatedAt: undefined!,
        type: FileType.Local,
      });

      if (info) {
        const deletedAt = info.deletedAt;
        const isRemoteNewer = DateTimeNs.isAfterOrEqual(remote.updatedAt, deletedAt);

        if (isRemoteNewer) {
          commands.push(FileChanges.updateLocal(remote.path));
        } else {
          commands.push(FileChanges.removeRemote(remote.path));
        }
      } else {
        commands.push(FileChanges.updateLocal(remote.path));
      }
    }

    return commands;
  }

  async detectConflicts(
    conflicts: { local: FileDescriptor; remote: FileDescriptor }[],
  ): Promise<FileChange[]> {
    const commands: FileChange[] = [];

    for (const { local, remote } of conflicts) {
      const isUpToDate = await this.comparator.compare(local, remote);

      if (isUpToDate) continue;

      const isLocalNewer = DateTimeNs.isAfterOrEqual(local.updatedAt, remote.updatedAt);
      if (isLocalNewer) {
        commands.push(FileChanges.updateRemote(local.path));
      } else {
        commands.push(FileChanges.updateLocal(local.path));
      }
    }

    return commands;
  }
}
