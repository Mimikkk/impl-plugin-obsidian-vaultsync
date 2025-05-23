import type { RequestContext } from "@server/core/infrastructure/routing/routers/requests/RequestContext.ts";

export class RouteRequestQueryParameters<P extends Record<string, any>> {
  static create<P extends Record<string, any>>(values: P): RouteRequestQueryParameters<P> {
    return new RouteRequestQueryParameters(values);
  }

  private constructor(
    public readonly values: P,
  ) {}

  static fromRequestContext<P extends Record<string, any>>(request: RequestContext): RouteRequestQueryParameters<P> {
    const values = Object.fromEntries(request.parameters.entries()) as P;
    return RouteRequestQueryParameters.create(values);
  }
}
