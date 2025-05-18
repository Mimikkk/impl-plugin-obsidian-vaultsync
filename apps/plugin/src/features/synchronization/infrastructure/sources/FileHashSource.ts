import { type Awaitable, BufferNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/core/domain/types/FileDescriptor.ts";

export class FileHashSource {
  static create(source: (descriptor: FileDescriptor) => Awaitable<ArrayBuffer | undefined>) {
    return new FileHashSource(source);
  }

  private constructor(private readonly source: (descriptor: FileDescriptor) => Awaitable<ArrayBuffer | undefined>) {}

  async download(descriptor: FileDescriptor): Promise<string> {
    const buffer = await this.source(descriptor);
    return BufferNs.toString(buffer!);
  }
}
