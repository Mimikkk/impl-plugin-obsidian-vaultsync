import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import { SyncEntryClient } from "@plugin/infrastructure/clients/SyncEntryClient.ts";
import { SyncFileSystemClient } from "@plugin/infrastructure/clients/SyncFileSystemClient.ts";
import { VaultManager } from "@plugin/infrastructure/managers/VaultManager.ts";

export namespace SyncService {
  const updateFile = async (descriptor: FileDescriptor) => {
    const buffer = await SyncFileSystemClient.read(descriptor.path);
    return VaultManager.update(descriptor.path, buffer);
  };

  export const sync = async () => {
    console.log("Synchronizing...");

    const descriptors = await SyncEntryClient.descriptors();
    await Promise.all(descriptors.filter(() => true).map(updateFile));

    console.log("Synchronized.");
  };
}
