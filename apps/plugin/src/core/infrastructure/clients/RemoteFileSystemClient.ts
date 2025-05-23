import { serializeSearchParams, singleton } from "@nimir/framework";
import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

@singleton
export class RemoteFileSystemClient {
  static create(
    url: string = ClientUrl.sync + "/filesystem",
  ) {
    return new RemoteFileSystemClient(url);
  }

  private constructor(
    private readonly url: string,
  ) {}

  read(path: string) {
    return ky.get(this.url, { searchParams: serializeSearchParams({ path }) })
      .arrayBuffer();
  }

  update(path: string, file: ArrayBuffer) {
    const data = new FormData();
    data.append("path", path);
    data.append("file", new Blob([file]));

    /* @ts-expect-error - ky typing fails to infer data property in 1.8.1 */
    return ky.post(this.url, { body: data });
  }

  remove(path: string, recursive = false) {
    return ky.delete(this.url, { json: { path, recursive } });
  }
}
