import { ServerConfiguration } from "@server/configurations/ServerConfiguration.ts";
import { HttpRouter } from "@server/infrastructure/routing/routes/HttpRouter.ts";
import { WsRouter } from "@server/infrastructure/routing/routes/WsRouter.ts";
import { ApplicationComposer } from "./infrastructure/middlewares/ApplicationComposer.ts";
import { MiddlewareNs } from "./infrastructure/middlewares/MiddlewareNs.ts";

export const server = ApplicationComposer.of([
  MiddlewareNs.redirect({
    redirects: [{ from: "/favicon.ico", to: "/static/favicon.ico" }],
  }),
  MiddlewareNs.barrier(),
  MiddlewareNs.timeout({ timeoutMs: 5000 }),
  MiddlewareNs.routes({ http: HttpRouter, ws: WsRouter }),
]);

Deno.serve(ServerConfiguration, (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Add CORS headers to all responses
  const response = server(req);

  // For Response objects, we need to clone and add headers
  if (response instanceof Response) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return newResponse;
  }

  // For Promise<Response>, we need to handle it after resolution
  return Promise.resolve(response).then((res) => {
    const newRes = new Response(res.body, res);
    newRes.headers.set("Access-Control-Allow-Origin", "*");
    newRes.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    newRes.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return newRes;
  });
});
