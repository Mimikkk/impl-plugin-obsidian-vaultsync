import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import { ClientUrl } from "@plugin/infrastructure/clients/ClientUrl.ts";
import { serializeSearchParams } from "@plugin/infrastructure/serializers/serializeSearchParams.ts";
import { type DateInit, DateTimeStr } from "@plugin/shared/types/DateTimeStr.ts";
import ky from "ky";

export namespace SyncEntryClient {
  const url = ClientUrl.sync + "/sync";

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

  const browseUrl = url + "/db/browse";
  const browse = (params: { folder: string; prefix?: string; levels?: number }) =>
    ky.get(browseUrl, { searchParams: serializeSearchParams(params) }).json<EntryDescriptor[]>();

  async function traverse(descriptors: FileDescriptor[], folder: string, root: string) {
    const files = await browse({ folder, prefix: root, levels: 0 });

    for (const file of files) {
      const path = root ? `${root}/${file.name}` : file.name;

      if (EntryTypeNs.isFile(file)) {
        descriptors.push({ path, updatedAt: DateTimeStr.asTimestamp(file.modTime) });
        continue;
      }

      await traverse(descriptors, folder, path);
    }

    return descriptors;
  }
  export const descriptors = () => traverse([], "default", "");

  export interface InfoResponse {
    deleted: boolean;
    modified: DateInit;
  }

  const infoUrl = url + "/db/file";
  export const info = async (path: string): Promise<InfoResponse | null> => {
    const result = await ky.get(infoUrl, { searchParams: { folder: "default", file: path } })
      .json<{ global: InfoResponse }>()
      .catch(() => null);

    return result?.global ?? null;
  };
}
