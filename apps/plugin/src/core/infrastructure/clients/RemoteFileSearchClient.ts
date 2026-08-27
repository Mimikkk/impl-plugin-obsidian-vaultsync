import { defineClient, type FileInfo, type FileMeta } from "@nimir/shared";
import { ClientUrl } from "./ClientUrl.ts";

export const RemoteFileSearchClient = defineClient({
  service: ClientUrl.sync,
  methods: ({ methods, types }) => ({
    list: methods.get({
      path: "/files/search/list",
      result: types.shape<FileInfo[]>,
    }),
    meta: methods.get({
      path: "/files/search/meta",
      params: types.shape<{ path: string }>,
      result: types.shape<FileMeta | undefined>,
      onError: () => undefined,
    }),
  }),
});
