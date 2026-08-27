import { singleton } from "@nimir/framework";
import { RemoteFileOperationsClient } from "@plugin/core/infrastructure/clients/RemoteFileOperationsClient.ts";
import type { FileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";

@singleton
export class RemoteFileOperations implements FileOperations {
  static create() {
    return new RemoteFileOperations();
  }

  async download(path: string): Promise<ArrayBuffer | undefined> {
    return await RemoteFileOperationsClient.download.fetch({ params: { path } });
  }

  async upload(path: string, content: ArrayBuffer) {
    await RemoteFileOperationsClient.upload.fetch({ payload: { path, file: content } });
  }

  async delete(path: string): Promise<void> {
    await RemoteFileOperationsClient.delete.fetch({ payload: { path } });
  }
}
