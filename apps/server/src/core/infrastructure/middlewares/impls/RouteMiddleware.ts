import type { Awaitable } from "@nimir/shared";
import type { Middleware } from "@server/core/infrastructure/middlewares/Middleware.ts";
import type { Router } from "@server/core/infrastructure/routing/routers/Router.ts";

export interface RouteMiddlewareOptions {
  http: Router;
  ws: Router;
}

export class RouteMiddleware implements Middleware {
  static create({ http, ws }: RouteMiddlewareOptions) {
    return new RouteMiddleware(http, ws);
  }

  private constructor(
    private readonly http: Router,
    private readonly ws: Router,
  ) {}

  handle(request: Request): Awaitable<Response> {
    return this.dispatch(request);
  }

  private dispatch(request: Request): Promise<Response> {
    if (request.headers.get("upgrade") === "websocket") {
      return this.ws.dispatch(request);
    }

    return this.http.dispatch(request);
  }
}
