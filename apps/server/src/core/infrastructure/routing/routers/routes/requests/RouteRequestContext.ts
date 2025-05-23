import type { Merge } from "@nimir/shared";
import type { RequestContext } from "@server/core/infrastructure/routing/routers/requests/RequestContext.ts";
import type { Route } from "@server/core/infrastructure/routing/routers/routes/Route.ts";
import { RouteRequestContent } from "./RouteRequestContent.ts";
import { RouteRequestQueryParameters } from "./RouteRequestQueryParameters.ts";
import { RouteRequestRouteParameters } from "./RouteRequestRouteParameters.ts";

export class RouteRequestContext<
  RP extends Record<string, any> = Record<string, any>,
  SP extends Record<string, any> = Record<string, any>,
  T extends object | null = object | null,
> {
  static create<
    RP extends Record<string, any>,
    SP extends Record<string, any>,
    T extends object | null,
  >(
    request: RequestContext,
    routeParameters: RouteRequestRouteParameters<RP>,
    queryParameters: RouteRequestQueryParameters<SP>,
    content: RouteRequestContent<T>,
  ) {
    return new RouteRequestContext(request, routeParameters, queryParameters, content);
  }

  private constructor(
    public readonly request: RequestContext,
    public readonly routeParameters: RouteRequestRouteParameters<RP>,
    public readonly queryParameters: RouteRequestQueryParameters<SP>,
    public readonly content: RouteRequestContent<T>,
  ) {}

  static async fromRequestRoute(request: RequestContext, route: Route) {
    return RouteRequestContext.create(
      request,
      RouteRequestRouteParameters.fromUrls(route.url, request.url),
      RouteRequestQueryParameters.fromRequestContext(request),
      await RouteRequestContent.fromRequestContext(request),
    );
  }

  withRouteParameters<P extends Record<string, any>>(parameters: P): RouteRequestContext<Merge<RP, P>, SP, T> {
    Object.assign(this.routeParameters.values, parameters);
    return this as RouteRequestContext<Merge<RP, P>, SP, T>;
  }

  withQueryParameters<P extends Record<string, any>>(parameters: P): RouteRequestContext<RP, Merge<SP, P>, T> {
    Object.assign(this.queryParameters.values, parameters);
    return this as RouteRequestContext<RP, Merge<SP, P>, T>;
  }
}
