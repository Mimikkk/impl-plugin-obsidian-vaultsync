import { DateTimeNs } from "@nimir/shared";
import { HashService } from "@plugin/application/services/HashService.ts";
import { LocalFileSystemService } from "@plugin/application/services/LocalFileSystemService.ts";
import { RemoteFileSystemService } from "@plugin/application/services/RemoteFileSystemService.ts";
import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import { SyncEventClient } from "@plugin/infrastructure/clients/SyncEventClient.ts";
import { ClientState } from "@plugin/presentation/state/ClientState.ts";

export namespace SyncService {
  const events = SyncEventClient;
  const remote = RemoteFileSystemService;
  const local = LocalFileSystemService;
  const hash = HashService;

  export const sync = async () => {
    console.log("Synchronizing...");

    await events.scan();

    const { localOnly, remoteOnly, both } = groupByLocation(local.list(), await remote.list());

    await syncLocalOnly(localOnly);
    await syncRemoteOnly(remoteOnly);
    await syncConflicts(both);

    ClientState.deleted.clear();
    ClientState.lastSync.now();

    console.log("Synchronized.");
    return "OK";
  };

  const compareFiles = async (path: string) => {
    const [localBuffer, remoteBuffer] = await Promise.all([local.read(path), remote.read(path)]);

    return hash.areEqual(localBuffer!, remoteBuffer!);
  };

  const groupByLocation = (locals: FileDescriptor[], remotes: FileDescriptor[]): {
    localOnly: FileDescriptor[];
    remoteOnly: FileDescriptor[];
    both: { local: FileDescriptor; remote: FileDescriptor }[];
  } => {
    const localOnly = [];
    const remoteOnly = [];
    const both = [];

    for (const descriptor of locals) {
      const remote = remotes.find((r) => r.path === descriptor.path);

      if (remote) {
        both.push({ local: descriptor, remote });
      } else {
        localOnly.push(descriptor);
      }
    }

    for (const descriptor of remotes) {
      const local = locals.find((l) => l.path === descriptor.path);

      if (!local) {
        remoteOnly.push(descriptor);
      }
    }

    return { localOnly, remoteOnly, both };
  };

  const syncLocalOnly = async (descriptors: FileDescriptor[]) => {
    for (const descriptor of descriptors) {
      const info = await remote.info(descriptor.path);

      const existed = info !== null;
      if (existed) {
        const wasDeleted = info.deleted;

        if (wasDeleted) {
          const deletedAt = info.modified;
          if (DateTimeNs.isAfterOrEqual(descriptor.updatedAt, deletedAt)) {
            const content = await local.read(descriptor.path);

            await remote.update(descriptor.path, content!);
          } else {
            await local.remove(descriptor.path);
          }
        }
      } else {
        const content = await local.read(descriptor.path);

        await remote.update(descriptor.path, content!);
      }
    }
  };

  const syncRemoteOnly = async (descriptors: FileDescriptor[]) => {
    for (const descriptor of descriptors) {
      const wasDeleted = ClientState.deleted.has(descriptor.path);

      if (wasDeleted) {
        const deletedAt = ClientState.deleted.get(descriptor.path)!;

        if (DateTimeNs.isAfterOrEqual(descriptor.updatedAt, deletedAt)) {
          const content = await local.read(descriptor.path);

          await remote.update(descriptor.path, content!);
        } else {
          await remote.remove(descriptor.path);
        }
      } else {
        const content = await remote.read(descriptor.path);

        await local.update(descriptor.path, content!);
      }
    }
  };

  const syncConflicts = async (conflicts: { local: FileDescriptor; remote: FileDescriptor }[]) => {
    for (const { local: l, remote: r } of conflicts) {
      const isUpToDate = await compareFiles(l.path);

      if (isUpToDate) continue;

      if (DateTimeNs.isBefore(l.updatedAt, r.updatedAt)) {
        const content = await local.read(l.path);
        await remote.update(l.path, content!);
      } else {
        const content = await local.read(l.path);
        await remote.update(l.path, content!);
      }
    }
  };
}
