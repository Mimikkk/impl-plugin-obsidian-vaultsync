import { resolve, singleton } from "@nimir/framework";
import type { FileInfo, FileMeta } from "@plugin/core/domain/types/FileTypes.ts";
import { LocalFileSystemClient } from "@plugin/core/infrastructure/clients/LocalFileSystemClient.ts";
import { type ISyncState, SyncState } from "@plugin/features/synchronization/infrastructure/SyncState.ts";
import type { FileSearch } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";

@singleton
export class LocalFileSearch implements FileSearch {
  static create(client = resolve(LocalFileSystemClient), state = resolve(SyncState)) {
    return new LocalFileSearch(client, state);
  }

  private constructor(
    private readonly client: LocalFileSystemClient,
    private readonly state: ISyncState,
  ) {}

  async list(): Promise<FileInfo[]> {
    return await this.client.list();
  }

  async meta(path: string): Promise<FileMeta | undefined> {
    const deletedAt = this.state.get("deletedFiles").get(path);

    if (deletedAt === undefined) return undefined;

    return { deleted: true, deletedAt };
  }
}
