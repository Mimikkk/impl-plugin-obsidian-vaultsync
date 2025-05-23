import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import { ServerConfiguration } from "@server/configurations/ServerConfiguration.ts";
import { ApplicationComposer } from "@server/core/infrastructure/middlewares/ApplicationComposer.ts";
import { MiddlewareNs } from "@server/core/infrastructure/middlewares/MiddlewareNs.ts";
import { HttpRouter } from "@server/core/infrastructure/routing/routes/HttpRouter.ts";
import { WsRouter } from "@server/core/infrastructure/routing/routes/WsRouter.ts";

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
