import type { HttpMethod } from "@nimir/shared";
import type { RequestMatcher } from "@server/core/infrastructure/routing/routers/matchers/RequestMatcher.ts";
import { RequestMethodMatcher } from "@server/core/infrastructure/routing/routers/matchers/RequestMethodMatcher.ts";
import { RequestRouteUrlMatcher } from "@server/core/infrastructure/routing/routers/matchers/RequestRouteUrlMatcher.ts";
import type { RequestContext } from "@server/core/infrastructure/routing/routers/requests/RequestContext.ts";
import type { RouteUrl } from "@server/core/infrastructure/routing/routers/routes/RouteUrl.ts";

export class HttpRouteMatcher implements RequestMatcher {
  static create(method: HttpMethod, url: RouteUrl): HttpRouteMatcher {
    return new HttpRouteMatcher(
      RequestMethodMatcher.create(method),
      RequestRouteUrlMatcher.create(url),
    );
  }

  private constructor(
    public readonly methodMatcher: RequestMethodMatcher,
    public readonly routeUrlMatcher: RequestRouteUrlMatcher,
  ) {}

  matches(request: RequestContext): boolean {
    if (!this.methodMatcher.matches(request)) return false;
    if (!this.routeUrlMatcher.matches(request)) return false;
    return true;
  }
}
