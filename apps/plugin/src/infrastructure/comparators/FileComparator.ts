import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import { LocalFileSystemClient } from "@plugin/infrastructure/clients/LocalFileSystemClient.ts";
import { RemoteFileSystemClient } from "@plugin/infrastructure/clients/RemoteFileSystemClient.ts";
import { DateTimeNs } from "../../../../../libs/shared/src/utils/DateTimeStr.ts";
import { BufferHashComparator } from "./BufferHashComparator.ts";

export namespace FileComparator {
  const locals = LocalFileSystemClient;
  const remotes = RemoteFileSystemClient;
  const hashes = BufferHashComparator;

  export async function compare(local: FileDescriptor, remote: FileDescriptor): Promise<boolean> {
    return areTimestampsNear(local, remote) || await areHashesEqual(local, remote);
  }

  function areTimestampsNear(local: FileDescriptor, remote: FileDescriptor): boolean {
    return DateTimeNs.within(local.updatedAt, remote.updatedAt, 1000);
  }

  async function areHashesEqual(local: FileDescriptor, remote: FileDescriptor): Promise<boolean> {
    const [localBuffer, remoteBuffer] = await Promise.all([
      locals.read(local.path),
      remotes.read(remote.path),
    ]);

    return await hashes.equals(localBuffer!, remoteBuffer!);
  }
}
