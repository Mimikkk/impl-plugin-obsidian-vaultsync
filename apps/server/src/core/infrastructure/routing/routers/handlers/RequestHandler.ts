import type { Awaitable } from "@nimir/shared";
import type { RouteRequestContext } from "@server/core/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";

export interface RequestHandler<C extends RouteRequestContext = RouteRequestContext> {
  handle(context: C): Awaitable<Response>;
}
