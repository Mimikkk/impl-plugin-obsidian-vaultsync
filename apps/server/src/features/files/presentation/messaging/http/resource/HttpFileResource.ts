import type { FileDescriptor, FileInfo } from "@server/core/domain/types/FileDescriptor.ts";

export interface HttpFileDescriptorResource extends FileDescriptor {}
export interface HttpFileInfoResource extends FileInfo {}

export namespace HttpFileResourceNs {
  export const fromDescriptors = (descriptors: FileDescriptor[]): HttpFileDescriptorResource[] => descriptors;
  export const fromDescriptor = (descriptor: FileDescriptor): HttpFileDescriptorResource => descriptor;

  export const fromInfo = (info: FileInfo): HttpFileInfoResource => ({
    deleted: info.deleted,
    deletedAt: info.deletedAt,
  });
}
