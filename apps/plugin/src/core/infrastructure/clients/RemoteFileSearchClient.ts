import { serializeSearchParams, singleton } from "@nimir/framework";
import ky from "ky";
import type { FileInfo, FileMeta } from "../../domain/types/FileTypes.ts";
import { ClientUrl } from "./ClientUrl.ts";

@singleton
export class RemoteFileSearchClient {
  static create(
    url: string = ClientUrl.sync + "/files/search",
  ) {
    return new RemoteFileSearchClient(url);
  }

  private constructor(
    private readonly url: string,
  ) {}

  async list() {
    return await ky.get(this.url + "/list")
      .json<FileInfo[]>();
  }

  async meta(path: string): Promise<FileMeta | undefined> {
    return await ky.get(this.url + "/info", { searchParams: serializeSearchParams({ file: path }) })
      .json<FileMeta>().catch(() => undefined);
  }
}
