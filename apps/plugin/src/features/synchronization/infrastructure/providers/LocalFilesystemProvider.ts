import type { FileDescriptor, FileInfo } from "@plugin/core/domain/types/FileDescriptor.ts";
import { LocalFileSystemClient } from "@plugin/core/infrastructure/clients/internal/LocalFileSystemClient.ts";
import { type ISyncState, SyncState } from "../SyncState.ts";
import type {
  FilesystemProvider,
} from "@plugin/features/synchronization/infrastructure/providers/FilesystemProvider.ts";

export class LocalFilesystemProvider implements FilesystemProvider {
  static create(
    client: LocalFileSystemClient = LocalFileSystemClient.create(),
    state: ISyncState = SyncState,
  ) {
    return new LocalFilesystemProvider(client, state);
  }

  private constructor(
    private readonly client: LocalFileSystemClient,
    private readonly state: ISyncState,
  ) {}

  list(): FileDescriptor[] {
    return this.client.list();
  }

  async read(path: string): Promise<ArrayBuffer | undefined> {
    return await this.client.read(path);
  }

  async update(path: string, content: ArrayBuffer): Promise<void> {
    await this.client.update(path, content);
  }

  async remove(path: string): Promise<void> {
    return await this.client.remove(path);
  }

  info(path: string): FileInfo | undefined {
    const deletedAt = this.state.get("deletedFiles").get(path);

    if (deletedAt === undefined) return undefined;

    return { deleted: true, deletedAt };
  }
}
