import type { RequestUrl } from "@server/core/infrastructure/routing/routers/requests/RequestUrl.ts";
import type { RouteUrl } from "@server/core/infrastructure/routing/routers/routes/RouteUrl.ts";
import { RouteRequestRouteParameterParser } from "./RouteRequestRouteParameterParser.ts";

export class RouteRequestRouteParameters<P extends Record<string, any>> {
  static create<P extends Record<string, any>>(values: P): RouteRequestRouteParameters<P> {
    return new RouteRequestRouteParameters(values);
  }

  private constructor(
    public readonly values: P,
  ) {}

  static fromUrls<P extends Record<string, any>>(
    { segments }: RouteUrl,
    { parts }: RequestUrl,
  ): RouteRequestRouteParameters<P> {
    return RouteRequestRouteParameters.create(
      RouteRequestRouteParameterParser.fromSegmentsAndParts<P>(segments, parts),
    );
  }
}
