import env from "@env";
import { defineClient } from "@nimir/shared";

export const api = defineClient({
  service: env.VAULT_SYNC_CLIENT_URL,
  methods: ({ methods, types }) => ({
    list: methods.get({
      path: "/files",
      result: types.shape<{ path: string; hash: string }[]>,
    }),
    get: methods.get({
      path: "/file",
      params: types.shape<{ path: string }>,
      result: types.shape<ArrayBuffer | undefined>,
      binary: true,
      onError: () => undefined,
    }),
    put: methods.put({
      path: "/file",
      params: types.shape<{ path: string }>,
      payload: types.shape<ArrayBuffer>,
    }),
    delete: methods.delete({
      path: "/file",
      params: types.shape<{ path: string }>,
      onError: () => undefined,
    }),
  }),
});
