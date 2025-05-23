import { resolve, singleton } from "@nimir/framework";
import type { FileDescriptor, FileInfo } from "@plugin/core/domain/types/FileDescriptor.ts";
import { RemoteFileClient } from "@plugin/core/infrastructure/clients/RemoteFileClient.ts";
import type { FilesystemProvider } from "@plugin/features/synchronization/infrastructure/providers/FilesystemProvider.ts";
import { RemoteFileSystemClient } from "../../../../core/infrastructure/clients/RemoteFileSystemClient.ts";

@singleton
export class RemoteFilesystemProvider implements FilesystemProvider {
  static create(
    fileOperations = resolve(RemoteFileSystemClient),
    searchOperations = resolve(RemoteFileClient),
  ) {
    return new RemoteFilesystemProvider(fileOperations, searchOperations);
  }

  private constructor(
    private readonly fileOperations: RemoteFileSystemClient,
    private readonly searchOperations: RemoteFileClient,
  ) {}

  async read(path: string): Promise<ArrayBuffer | undefined> {
    return await this.fileOperations.read(path);
  }

  async update(path: string, file: ArrayBuffer): Promise<void> {
    await this.fileOperations.update(path, file);
  }

  async remove(path: string, recursive = false): Promise<void> {
    await this.fileOperations.remove(path, recursive);
  }

  async list(): Promise<FileDescriptor[]> {
    return await this.searchOperations.list();
  }

  async info(path: string): Promise<FileInfo | undefined> {
    return await this.searchOperations.info(path);
  }
}
