import { resolve, singleton } from "@nimir/framework";
import { RemoteFileOperationsClient } from "@plugin/core/infrastructure/clients/RemoteFileOperationsClient.ts";
import type { FileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";

@singleton
export class RemoteFileOperations implements FileOperations {
  static create(client = resolve(RemoteFileOperationsClient)) {
    return new RemoteFileOperations(client);
  }

  private constructor(
    private readonly client: RemoteFileOperationsClient,
  ) {}

  async download(path: string): Promise<ArrayBuffer | undefined> {
    return await this.client.download(path);
  }

  async upload(path: string, content: ArrayBuffer) {
    await this.client.upload(path, content);
  }

  async delete(path: string): Promise<void> {
    await this.client.delete(path);
  }
}
