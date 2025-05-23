import { serializeSearchParams, singleton } from "@nimir/framework";
import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

@singleton
export class RemoteFileOperationsClient {
  static create(
    url: string = ClientUrl.sync + "/files/operations",
  ) {
    return new RemoteFileOperationsClient(url);
  }

  private constructor(
    private readonly url: string,
  ) {}

  async download(path: string): Promise<ArrayBuffer | undefined> {
    return await ky.get(this.url + "/download", { searchParams: serializeSearchParams({ path }) })
      .arrayBuffer()
      .catch(() => undefined);
  }

  async upload(path: string, file: ArrayBuffer) {
    const data = new FormData();
    data.append("path", path);
    data.append("file", new Blob([file]));

    /* @ts-expect-error - ky typing fails to infer data property in 1.8.1 */
    return await ky.post(this.url + "/upload", { body: data });
  }

  async delete(path: string, recursive = false) {
    return await ky.delete(this.url + "/delete", { json: { path, recursive } });
  }
}
