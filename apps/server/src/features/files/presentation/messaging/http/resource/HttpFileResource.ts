import type { FileInfo, FileMeta } from "@nimir/shared";

export interface HttpFileInfoResource extends FileInfo {}
export interface HttpFileMetaResource extends FileMeta {}

export namespace HttpFileResourceNs {
  export const fromDescriptors = (descriptors: FileInfo[]): HttpFileInfoResource[] => descriptors;
  export const fromDescriptor = (descriptor: FileInfo): HttpFileInfoResource => descriptor;

  export const fromInfo = (info: FileMeta): HttpFileMetaResource => ({
    deleted: info.deleted,
    deletedAt: info.deletedAt,
  });
}
