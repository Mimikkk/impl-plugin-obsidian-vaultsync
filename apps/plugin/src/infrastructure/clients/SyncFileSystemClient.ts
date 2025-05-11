import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

export namespace SyncFileSystemClient {
  const url = ClientUrl.sync + "/filesystem";

  export const read = (path: string) => ky.get(url, { searchParams: { path } }).arrayBuffer();
  export const write = (path: string, file: ArrayBuffer) => {
    const formData = new FormData();
    formData.append("path", path);
    formData.append("file", new Blob([file]));

    /* @ts-expect-error - ky typing fails to infer data property in 1.8.1 */
    return ky.post(url, { body: formData });
  };
  export const remove = (path: string, recursive = false) => ky.post(url, { json: { path, recursive } });
}
