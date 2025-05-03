import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import { ServerConfiguration } from "@server/configurations/ServerConfiguration.ts";
import { HttpRouter } from "@server/infrastructure/routing/routes/HttpRouter.ts";
import { WsRouter } from "@server/infrastructure/routing/routes/WsRouter.ts";
import { ApplicationComposer } from "./infrastructure/middlewares/ApplicationComposer.ts";
import { MiddlewareNs } from "./infrastructure/middlewares/MiddlewareNs.ts";

export const server = ApplicationComposer.of([
  MiddlewareNs.redirect({
    redirects: [
      { from: "/favicon.ico", to: "/static/favicon.ico" },
      {
        from: "/sync/*",
        to: `${EnvironmentConfiguration.syncthingUrl}/rest/*`,
        with: { "X-API-Key": EnvironmentConfiguration.syncthingApiKey },
      },
    ],
  }),
  MiddlewareNs.barrier(),
  MiddlewareNs.timeout({ timeoutMs: 5000 }),
  MiddlewareNs.cors(),
  MiddlewareNs.routes({ http: HttpRouter, ws: WsRouter }),
]);

Deno.serve(ServerConfiguration, server);
