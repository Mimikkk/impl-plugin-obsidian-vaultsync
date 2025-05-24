import { resolve, singleton } from "@nimir/framework";
import type { FileInfo, FileMeta } from "@nimir/shared";
import { RemoteFileSearchClient } from "@plugin/core/infrastructure/clients/RemoteFileSearchClient.ts";
import type { FileSearch } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";

@singleton
export class RemoteFileSearch implements FileSearch {
  static create(client = resolve(RemoteFileSearchClient)) {
    return new RemoteFileSearch(client);
  }

  private constructor(
    private readonly client: RemoteFileSearchClient,
  ) {}

  async list(): Promise<FileInfo[]> {
    return await this.client.list();
  }

  async meta(path: string): Promise<FileMeta | undefined> {
    return await this.client.meta(path);
  }
}
