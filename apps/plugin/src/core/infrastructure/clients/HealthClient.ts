import { defineClient } from "@nimir/shared";
import { ClientUrl } from "./ClientUrl.ts";

export const HealthClient = defineClient({
  service: ClientUrl.sync,
  methods: ({ methods, types }) => ({
    check: methods.get({
      path: "/health",
      result: types.shape<{ status: string; message: string }>,
    }),
  }),
});
