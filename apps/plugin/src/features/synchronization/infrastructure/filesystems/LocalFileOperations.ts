import { resolve, singleton } from "@nimir/framework";
import { LocalFileSystemClient } from "@plugin/core/infrastructure/clients/LocalFileSystemClient.ts";
import type { FileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";

@singleton
export class LocalFileOperations implements FileOperations {
  static create(client = resolve(LocalFileSystemClient)) {
    return new LocalFileOperations(client);
  }

  private constructor(
    private readonly client: LocalFileSystemClient,
  ) {}

  async download(path: string): Promise<ArrayBuffer | undefined> {
    return await this.client.read(path);
  }

  async upload(path: string, content: ArrayBuffer): Promise<void> {
    await this.client.update(path, content);
  }

  async delete(path: string): Promise<void> {
    await this.client.remove(path);
  }
}
