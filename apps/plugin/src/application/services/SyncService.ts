import { SyncEntryClient } from "@plugin/infrastructure/clients/SyncEntryClient.ts";
import { SyncEventClient } from "@plugin/infrastructure/clients/SyncEventClient.ts";
import { SyncFileSystemClient } from "@plugin/infrastructure/clients/SyncFileSystemClient.ts";
import { ClientState } from "@plugin/presentation/state/ClientState.ts";
import { DateTimeNs } from "@plugin/shared/types/DateTimeStr.ts";
import { VaultClient } from "../../infrastructure/clients/VaultClient.ts";

export namespace SyncService {
  const events = SyncEventClient;
  const remote = SyncEntryClient;
  const files = SyncFileSystemClient;
  const local = VaultClient;

  export const sync = async () => {
    console.log("Synchronizing...");

    await events.scan();
    const remoteDescriptors = await remote.descriptors();
    const localDescriptors = local.descriptors();

    for (const localDescriptor of localDescriptors) {
      const remoteDescriptor = remoteDescriptors.find((r) => r.path === localDescriptor.path);

      if (remoteDescriptor) {
        const isUpToDate = await hasHashEqual(localDescriptor.path);
        if (!isUpToDate) {
          if (DateTimeNs.isBefore(localDescriptor.updatedAt, remoteDescriptor.updatedAt)) {
            await updateLocal(localDescriptor.path);
          } else {
            await updateRemote(localDescriptor.path);
          }
        }
      } else {
        const file = await remote.info(localDescriptor.path);

        if (file) {
          const wasDeleted = file.deleted;

          if (wasDeleted) {
            const deletedAt = file.modified;
            if (DateTimeNs.isAfterOrEqual(localDescriptor.updatedAt, deletedAt)) {
              await updateRemote(localDescriptor.path);
            } else {
              await removeLocal(localDescriptor.path);
            }
          }
        } else {
          await updateRemote(localDescriptor.path);
        }
      }
    }

    for (const remoteDescriptor of remoteDescriptors) {
      const localDescriptor = localDescriptors.find((l) => l.path === remoteDescriptor.path);

      if (!localDescriptor) {
        const wasDeleted = ClientState.deleted.has(remoteDescriptor.path);

        if (wasDeleted) {
          const deletedAt = ClientState.deleted.get(remoteDescriptor.path)!;
          if (DateTimeNs.isAfterOrEqual(remoteDescriptor.updatedAt, deletedAt)) {
            await updateLocal(remoteDescriptor.path);
          } else {
            await removeRemote(remoteDescriptor.path);
          }
        } else {
          await updateLocal(remoteDescriptor.path);
        }
      }
    }

    console.log("Synchronized.");
    return "OK";
  };

  const hasHashEqual = async (path: string) => {
    const localBuffer = await local.read(path);
    const remoteBuffer = await files.read(path);

    const isEqual = await isHashEqual(localBuffer!, remoteBuffer!);
    return isEqual;
  };

  const isHashEqual = async (a: ArrayBuffer, b: ArrayBuffer): Promise<boolean> => {
    const [hash1, hash2] = await Promise.all([hash(a), hash(b)]);
    return areBuffersEqual(hash1, hash2);
  };

  const hash = async (buffer: ArrayBuffer): Promise<ArrayBuffer> => await crypto.subtle.digest("SHA-256", buffer);

  const areBuffersEqual = (a: ArrayBuffer, b: ArrayBuffer): boolean => areViewsEqual(new DataView(a), new DataView(b));
  const areViewsEqual = (a: DataView, b: DataView): boolean => {
    if (a.byteLength !== b.byteLength) return false;

    for (let i = 0; i < a.byteLength; i++) {
      if (a.getUint8(i) !== b.getUint8(i)) return false;
    }

    return true;
  };

  const updateRemote = async (path: string) => {
    const content = await local.read(path);

    if (!content) {
      console.warn("Failed to update the remote file", path);
      return;
    }

    return files.write(path, content);
  };

  const removeLocal = (path: string) => local.remove(path);
  const removeRemote = (path: string) => files.remove(path);

  const updateLocal = async (path: string) => {
    const content = await files.read(path);
    return local.update(path, content);
  };
}
