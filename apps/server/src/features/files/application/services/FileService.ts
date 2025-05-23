import { resolve, singleton } from "@nimir/framework";
import { DateTimeStr } from "@nimir/shared";
import { type FileDescriptor, FileType } from "@server/core/domain/types/FileDescriptor.ts";
import {
  SyncthingDatabaseClient,
  SyncthingDatabaseClientNs,
} from "@server/core/infrastructure/clients/SyncthingDatabaseClient.ts";

@singleton
export class FileService {
  static create(client = resolve(SyncthingDatabaseClient)) {
    return new FileService(client);
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

  private async traverse(descriptors: FileDescriptor[], folder: string, root: string) {
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
