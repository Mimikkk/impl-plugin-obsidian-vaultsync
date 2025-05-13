import { type DateInit, DateTimeStr } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";
import { ExternalClientUrl } from "@plugin/core/infrastructure/clients/external/ExternalClientUrl.ts";
import { serializeSearchParams } from "@plugin/core/infrastructure/serializers/serializeSearchParams.ts";
import ky from "ky";

export class RemoteFileSystemClient {
  static create(
    url: string = ExternalClientUrl.sync,
  ) {
    return new RemoteFileSystemClient(url);
  }

  private constructor(
    private readonly url: string,
  ) {}

  read(path: string) {
    return ky.get(this.url + "/filesystem", { searchParams: { path } }).arrayBuffer();
  }

  update(path: string, file: ArrayBuffer) {
    const data = new FormData();
    data.append("path", path);
    data.append("file", new Blob([file]));

    /* @ts-expect-error - ky typing fails to infer data property in 1.8.1 */
    return ky.post(this.url + "/filesystem", { body: data });
  }

  remove(path: string, recursive = false) {
    return ky.post(this.url + "/filesystem", { json: { path, recursive } });
  }

  browse(params: { folder: string; prefix?: string; levels?: number }) {
    return ky.get(this.url + "/sync/db/browse", { searchParams: serializeSearchParams(params) }).json<
      RemoteFileSystemClient.EntryDescriptor[]
    >();
  }
  async list() {
    return await this.traverse([], "default", "");
  }

  async info(path: string): Promise<RemoteFileSystemClient.InfoResponse | null> {
    const result = await ky.get(this.url + "/sync/db/file", { searchParams: { folder: "default", file: path } })
      .json<{ global: RemoteFileSystemClient.InfoResponse }>()
      .catch(() => null);

    return result?.global ?? null;
  }

  private async traverse(descriptors: FileDescriptor[], folder: string, root: string) {
    const files = await this.browse({ folder, prefix: root, levels: 0 });

    for (const file of files) {
      const path = root ? `${root}/${file.name}` : file.name;

      if (RemoteFileSystemClient.EntryTypeNs.isFile(file)) {
        descriptors.push({ path, updatedAt: DateTimeStr.asTimestamp(file.modTime), type: "remote" });
        continue;
      }

      await this.traverse(descriptors, folder, path);
    }

    return descriptors;
  }
}

export namespace RemoteFileSystemClient {
  export enum EntryType {
    File = "FILE_INFO_TYPE_FILE",
    Directory = "FILE_INFO_TYPE_DIRECTORY",
    Symlink = "FILE_INFO_TYPE_SYMLINK",
    SymlinkFile = "FILE_INFO_TYPE_SYMLINK_FILE",
    SymlinkDirectory = "FILE_INFO_TYPE_SYMLINK_DIRECTORY",
  }

  export namespace EntryTypeNs {
    const { File, Directory, Symlink, SymlinkFile, SymlinkDirectory } = EntryType;

    export const isFile = (entry: any) => entry.type === File || isSymlink(entry);
    export const isDirectory = ({ type }: any) => type === Directory || type === SymlinkDirectory;
    export const isSymlink = ({ type }: any) => type === Symlink || type === SymlinkFile || type === SymlinkDirectory;
  }

  export interface EntryDescriptor {
    modTime: DateInit;
    name: string;
    size: number;
    type: EntryType;
  }

  export interface InfoResponse {
    deleted: boolean;
    modified: DateInit;
  }
}
