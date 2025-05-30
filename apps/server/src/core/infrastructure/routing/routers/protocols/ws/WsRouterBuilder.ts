import { resolve } from "@nimir/framework";
import { RequestControllerHandler } from "@server/core/infrastructure/routing/routers/handlers/RequestControllerHandler.ts";
import { WsRouteMatcher } from "@server/core/infrastructure/routing/routers/protocols/ws/WsRouteMatcher.ts";
import { Router } from "@server/core/infrastructure/routing/routers/Router.ts";
import { Route } from "@server/core/infrastructure/routing/routers/routes/Route.ts";
import { RouteUrl } from "@server/core/infrastructure/routing/routers/routes/RouteUrl.ts";
import { ControllerStore } from "../../../controllers/ControllerStore.ts";
import type { Controller, ControllerClass, ControllerKey } from "../../../controllers/ControllerTypes.ts";

export class WsRouterBuilder<R extends Route[] = Route[]> {
  static create<R extends Route[] = []>(
    routes: R = [] as unknown as R,
    controllers = resolve(ControllerStore),
  ): WsRouterBuilder<R> {
    return new WsRouterBuilder(routes, controllers);
  }

  private constructor(
    private readonly routes: R,
    private readonly controllers: ControllerStore,
  ) {}

  ws<
    P extends string,
    C extends ControllerClass,
    H extends ControllerKey<Controller<C>>,
  >({ path, Controller, handler }: { path: P; Controller: C; handler: H }): WsRouterBuilder<[...R, Route]> {
    const url = RouteUrl.fromRoutePath(path);

    const controller = this.controllers.get(Controller);

    const route = Route.create(
      url,
      WsRouteMatcher.create(url),
      RequestControllerHandler.create(controller, handler),
    );

    this.routes.push(route);

    return this as unknown as WsRouterBuilder<[...R, Route]>;
  }

  build(): Router<R> {
    return Router.create(this.routes);
  }
}
