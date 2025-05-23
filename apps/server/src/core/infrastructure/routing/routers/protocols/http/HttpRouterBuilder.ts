import { resolve } from "@nimir/framework";
import type { HttpMethod } from "@nimir/shared";
import { RequestControllerHandler } from "@server/core/infrastructure/routing/routers/handlers/RequestControllerHandler.ts";
import { HttpRouteMatcher } from "@server/core/infrastructure/routing/routers/protocols/http/HttpRouteMatcher.ts";
import { Router } from "@server/core/infrastructure/routing/routers/Router.ts";
import { Route } from "@server/core/infrastructure/routing/routers/routes/Route.ts";
import { RouteUrl } from "@server/core/infrastructure/routing/routers/routes/RouteUrl.ts";
import { ControllerStore } from "../../../controllers/ControllerStore.ts";
import type { Controller, ControllerClass, ControllerKey } from "../../../controllers/ControllerTypes.ts";

export class HttpRouterBuilder<R extends Route[] = Route[]> {
  static create<R extends Route[] = []>(
    routes: R = [] as unknown as R,
    controllers = resolve(ControllerStore),
  ): HttpRouterBuilder<R> {
    return new HttpRouterBuilder(routes, controllers);
  }

  private constructor(
    private readonly routes: R,
    private readonly controllers: ControllerStore,
  ) {}

  add<
    M extends HttpMethod,
    P extends string,
    C extends ControllerClass,
    H extends ControllerKey<Controller<C>>,
  >(
    { method, path, Controller, handler }: { method: M; path: P; Controller: C; handler: H },
  ): HttpRouterBuilder<[...R, Route]> {
    const url = RouteUrl.fromRoutePath(path);

    const controller = this.controllers.get(Controller);

    const route = Route.create(
      url,
      HttpRouteMatcher.create(method, url),
      RequestControllerHandler.create(controller, handler),
    );

    this.routes.push(route);

    return this as unknown as HttpRouterBuilder<[...R, Route]>;
  }

  build(): Router<R> {
    return Router.create(this.routes);
  }
}
