import { resolve, singleton } from "@nimir/framework";
import { DateTimeNs, type FileInfo, FileType } from "@nimir/shared";
import { FileChanges, type FileChange } from "../../domain/FileChange.ts";
import { FileComparator } from "@plugin/features/synchronization/infrastructure/comparators/FileComparator.ts";
import { FileHashProvider } from "@plugin/features/synchronization/infrastructure/providers/FileHashProvider.ts";
import { FileProvider } from "@plugin/features/synchronization/infrastructure/providers/FileProvider.ts";
import { BaseHashStore } from "@plugin/features/synchronization/infrastructure/stores/BaseHashStore.ts";

@singleton
export class FileChangeDetector {
  static create(
    files = resolve(FileProvider),
    comparator = resolve(FileComparator),
    hashes = resolve(FileHashProvider),
    bases = resolve(BaseHashStore),
  ) {
    return new FileChangeDetector(files, comparator, hashes, bases);
  }

  private constructor(
    private readonly files: FileProvider,
    private readonly comparator: FileComparator,
    private readonly hashes: FileHashProvider,
    private readonly bases: BaseHashStore,
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

  async detectLocalOnly(locals: FileInfo[]): Promise<FileChange[]> {
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

  async detectRemoteOnly(remotes: FileInfo[]): Promise<FileChange[]> {
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

  async detectConflicts(pairs: { local: FileInfo; remote: FileInfo }[]): Promise<FileChange[]> {
    const commands: FileChange[] = [];

    for (const { local, remote } of pairs) {
      const isUpToDate = await this.comparator.compare(local, remote);
      if (isUpToDate) continue;

      const [localHash, remoteHash] = await Promise.all([
        this.hashes.get(local),
        this.hashes.get(remote),
      ]);
      const base = this.bases.get(local.path);

      if (base === remoteHash) {
        commands.push(FileChanges.updateRemote(local.path));
      } else if (base === localHash) {
        commands.push(FileChanges.updateLocal(local.path));
      } else if (base === undefined) {
        const isLocalNewer = DateTimeNs.isAfterOrEqual(local.updatedAt, remote.updatedAt);
        commands.push(
          isLocalNewer ? FileChanges.updateRemote(local.path) : FileChanges.updateLocal(local.path),
        );
      } else {
        commands.push(FileChanges.conflict(local.path));
      }
    }

    return commands;
  }
}
