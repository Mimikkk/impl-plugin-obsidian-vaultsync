import { FileType } from "@server/core/domain/types/FileDescriptor.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { HttpFileResourceNs } from "@server/features/files/presentation/messaging/http/resource/HttpFileResource.ts";

export namespace HttpFileResponse {
  export const [Info, info] = HttpJsonResponse.custom({
    content: HttpFileResourceNs.fromInfo,
    example: { deleted: false, deletedAt: "2025-05-24T00:00:00.000Z" },
    schema: {},
    name: "FileInfo",
    description: "The meta information of about the file",
    status: 200,
  });

  export const [List, list] = HttpJsonResponse.custom({
    content: HttpFileResourceNs.fromDescriptors,
    example: [{
      path: "abc/abc.ts",
      updatedAt: 1747583346675,
      type: FileType.Remote,
    }],
    schema: {},
    name: "FileList",
    description: "The list of files",
    status: 200,
  });
}
