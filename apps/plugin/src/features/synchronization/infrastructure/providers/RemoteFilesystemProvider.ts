import { resolve, singleton } from "@nimir/framework";
import type { FileDescriptor, FileInfo } from "@plugin/core/domain/types/FileDescriptor.ts";
import type { FilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/FilesystemProvider.ts";
import { RemoteFileSystemClient } from "../../../../core/infrastructure/clients/RemoteFileSystemClient.ts";

@singleton
export class RemoteFilesystemProvider implements FilesystemProvider {
  static create(
    client = resolve(RemoteFileSystemClient),
  ) {
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
