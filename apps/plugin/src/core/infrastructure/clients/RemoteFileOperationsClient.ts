import { defineClient } from "@nimir/shared";
import { ClientUrl } from "./ClientUrl.ts";

export const RemoteFileOperationsClient = defineClient({
  service: ClientUrl.sync,
  methods: ({ methods, types }) => ({
    download: methods.get({
      path: "/files/operations/download",
      params: types.shape<{ path: string }>,
      result: types.shape<ArrayBuffer | undefined>,
      binary: true,
      onError: () => undefined,
    }),
    upload: methods.post({
      path: "/files/operations/upload",
      payload: ({ path, file }: { path: string; file: ArrayBuffer }) => {
        const data = new FormData();
        data.append("path", path);
        data.append("file", new Blob([file]));
        return data;
      },
    }),
    delete: methods.delete({
      path: "/files/operations/delete",
      payload: types.shape<{ path: string; recursive?: boolean }>,
    }),
  }),
});
