import type { FileDescriptor, FileInfo } from "@plugin/core/domain/types/FileDescriptor.ts";
import { RemoteFileSystemClient } from "@plugin/core/infrastructure/clients/external/RemoteFileSystemClient.ts";
import type { FilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/FilesystemProvider.ts";

export class RemoteFilesystemProvider implements FilesystemProvider {
  static create(client: RemoteFileSystemClient = RemoteFileSystemClient.create()) {
    return new RemoteFilesystemProvider(client);
  }

  private constructor(
    private readonly client: RemoteFileSystemClient,
  ) {}

  async list(): Promise<FileDescriptor[]> {
    return await this.client.list();
  }

  async read(path: string): Promise<ArrayBuffer | undefined> {
    return await this.client.read(path);
  }

  async update(path: string, file: ArrayBuffer): Promise<void> {
    await this.client.update(path, file);
  }

  async remove(path: string, recursive = false): Promise<void> {
    await this.client.remove(path, recursive);
  }

  async info(path: string): Promise<FileInfo | undefined> {
    const info = await this.client.info(path);
    if (info === undefined) return undefined;

    return { deleted: info.deleted, deletedAt: info.modified };
  }
}
