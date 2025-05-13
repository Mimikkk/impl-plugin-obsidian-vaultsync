import { ExternalClientUrl } from "@plugin/core/infrastructure/clients/external/ExternalClientUrl.ts";
import { SyncEntryClient } from "@plugin/core/infrastructure/clients/external/SyncEntryClient.ts";
import ky from "ky";

export class RemoteFileSystemClient {
  static create(
    url: string = ExternalClientUrl.sync + "/filesystem",
    client: SyncEntryClient = SyncEntryClient.create(),
  ) {
    return new RemoteFileSystemClient(url, client);
  }

  private constructor(
    private readonly url: string,
    private readonly entries: SyncEntryClient,
  ) {}

  read(path: string) {
    return ky.get(this.url, { searchParams: { path } }).arrayBuffer();
  }

  update(path: string, file: ArrayBuffer) {
    const data = new FormData();
    data.append("path", path);
    data.append("file", new Blob([file]));

    /* @ts-expect-error - ky typing fails to infer data property in 1.8.1 */
    return ky.post(this.url, { body: data });
  }

  remove(path: string, recursive = false) {
    return ky.post(this.url, { json: { path, recursive } });
  }

  list() {
    return this.entries.descriptors();
  }

  info(path: string) {
    return this.entries.info(path);
  }
}
