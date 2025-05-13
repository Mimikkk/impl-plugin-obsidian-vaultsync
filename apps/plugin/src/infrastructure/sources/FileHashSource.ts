import { type Awaitable, BufferNs } from "@nimir/shared";
import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";

export class FileHashSource {
  static create(source: (descriptor: FileDescriptor) => Awaitable<ArrayBuffer | null>) {
    return new FileHashSource(source);
  }

  private constructor(private readonly source: (descriptor: FileDescriptor) => Awaitable<ArrayBuffer | null>) {}

  async download(descriptor: FileDescriptor): Promise<string> {
    const buffer = await this.source(descriptor);
    return BufferNs.toString(buffer!);
  }
}
