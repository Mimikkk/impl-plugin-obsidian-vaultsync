import { resolve, singleton } from "@nimir/framework";
import { DateTimeStr } from "@nimir/shared";
import {
  SyncthingDatabaseClient,
  SyncthingDatabaseClientNs,
} from "@server/core/infrastructure/clients/SyncthingDatabaseClient.ts";
import { type FileInfo, FileType } from "../../../../core/domain/types/FileTypes.ts";

@singleton
export class FileSearchService {
  static create(client = resolve(SyncthingDatabaseClient)) {
    return new FileSearchService(client);
  }

  private constructor(
    private readonly client: SyncthingDatabaseClient,
  ) {}

  async info(params: FileServiceNs.InfoParams) {
    return await this.client.info(params);
  }

  async list(params: FileServiceNs.ListParams) {
    return await this.traverse([], params.folder, params.prefix ?? "");
  }

  private async traverse(descriptors: FileInfo[], folder: string, root: string) {
    const files = await this.client.browse({ folder, prefix: root, levels: 0 });

    for (const file of files) {
      const path = root ? `${root}/${file.name}` : file.name;

      if (SyncthingDatabaseClientNs.EntryTypeNs.isFile(file)) {
        descriptors.push({ path, updatedAt: DateTimeStr.asTimestamp(file.modTime), type: FileType.Remote });
        continue;
      }

      await this.traverse(descriptors, folder, path);
    }

    return descriptors;
  }
}

export namespace FileServiceNs {
  export interface ListParams {
    folder: string;
    prefix?: string;
  }

  export interface InfoParams {
    folder: string;
    file: string;
  }
}
