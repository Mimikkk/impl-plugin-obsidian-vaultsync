import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

export namespace SyncFileSystemClient {
  const url = ClientUrl.sync + "/filesystem";

  export interface InfoResponse {
    createdAt: string;
    updatedAt: string;
    size: number;
  }

  export const info = (path: string) => ky.get(url, { searchParams: { path } }).json<InfoResponse>();
  export const read = (path: string) => ky.get(url, { searchParams: { path } }).arrayBuffer();
  export const write = (path: string, content: Uint8Array) => ky.post(url, { json: { path, content } });
  export const remove = (path: string, recursive = false) => ky.post(url, { json: { path, recursive } });
}
