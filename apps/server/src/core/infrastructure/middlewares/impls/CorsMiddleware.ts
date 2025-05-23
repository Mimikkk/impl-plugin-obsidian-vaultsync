import type { Dispatch, Middleware } from "@server/core/infrastructure/middlewares/Middleware.ts";

const CorsResponse = new Response(null, {
  status: 204,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  },
});

export class CorsMiddleware implements Middleware {
  static create(): CorsMiddleware {
    return new CorsMiddleware();
  }

  private constructor() {}

  async handle(request: Request, next: Dispatch): Promise<Response> {
    if (request.method === "OPTIONS") return CorsResponse;

    const response = await next(request);

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
  }
}
