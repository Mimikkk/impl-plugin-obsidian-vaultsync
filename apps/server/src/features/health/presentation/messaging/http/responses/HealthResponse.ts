import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";

export namespace HealthResponse {
  export const [Ok, ok] = HttpJsonResponse.custom({
    content: () => ({ status: "OK", message: "The service is running." }),
    description: "The health of the server",
    example: { status: "OK", message: "The service is running." },
    name: "Health",
    schema: { type: "object", properties: { status: { type: "string" }, message: { type: "string" } } },
    status: 200,
  });
}
