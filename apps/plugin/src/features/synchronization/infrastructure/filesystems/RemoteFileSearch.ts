import { singleton } from "@nimir/framework";
import type { FileInfo, FileMeta } from "@nimir/shared";
import { RemoteFileSearchClient } from "@plugin/core/infrastructure/clients/RemoteFileSearchClient.ts";
import type { FileSearch } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";

@singleton
export class RemoteFileSearch implements FileSearch {
  static create() {
    return new RemoteFileSearch();
  }

  async list(): Promise<FileInfo[]> {
    return await RemoteFileSearchClient.list.fetch({});
  }

  async meta(path: string): Promise<FileMeta | undefined> {
    return await RemoteFileSearchClient.meta.fetch({ params: { path } });
  }
}
