import { serializeSearchParams, singleton } from "@nimir/framework";
import type { FileDescriptor, FileInfo } from "@plugin/core/domain/types/FileDescriptor.ts";
import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

@singleton
export class RemoteFileClient {
  static create(
    url: string = ClientUrl.sync + "/files",
  ) {
    return new RemoteFileClient(url);
  }

  private constructor(
    private readonly url: string,
  ) {}

  async list() {
    return await ky.get(this.url)
      .json<FileDescriptor[]>();
  }

  async info(path: string): Promise<FileInfo | undefined> {
    return await ky.get(this.url + "/info", { searchParams: serializeSearchParams({ file: path }) })
      .json<FileInfo>().catch(() => undefined);
  }
}
