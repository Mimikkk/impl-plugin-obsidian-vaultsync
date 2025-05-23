import { serializeSearchParams, singleton } from "@nimir/framework";
import type { DateInit } from "@nimir/shared";
import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

@singleton
export class SyncthingDatabaseClient {
  static create(
    url: string = ClientUrl.sync,
    headers: HeadersInit = { "X-API-Key": EnvironmentConfiguration.syncthingApiKey },
  ) {
    return new SyncthingDatabaseClient(url, headers);
  }

  private constructor(
    private readonly url: string,
    private readonly headers: HeadersInit,
  ) {}

  browse(params: SyncthingDatabaseClientNs.BrowseParams) {
    return ky.get(this.url + "/db/browse", { searchParams: serializeSearchParams(params), headers: this.headers })
      .json<SyncthingDatabaseClientNs.Entry[]>();
  }

  async info(params: SyncthingDatabaseClientNs.InfoParams): Promise<SyncthingDatabaseClientNs.FileInfo | undefined> {
    const result = await ky.get(this.url + "/db/file", {
      searchParams: serializeSearchParams(params),
      headers: this.headers,
    })
      .json<{ global: SyncthingDatabaseClientNs.FileInfo }>()
      .catch(() => undefined);

    return result?.global;
  }
}

export namespace SyncthingDatabaseClientNs {
  export interface BrowseParams {
    folder: string;
    prefix?: string;
    levels?: number;
  }

  export interface InfoParams {
    folder: string;
    file: string;
  }

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

  export interface Entry {
    modTime: DateInit;
    name: string;
    size: number;
    type: EntryType;
  }

  export interface FileInfo {
    deleted: boolean;
    modified: DateInit;
  }
}
