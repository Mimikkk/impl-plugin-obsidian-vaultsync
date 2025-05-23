import type { RequestHandler } from "../handlers/RequestHandler.ts";
import type { RequestMatcher } from "../matchers/RequestMatcher.ts";
import type { RouteUrl } from "./RouteUrl.ts";
export class Route {
  static create = (url: RouteUrl, matcher: RequestMatcher, handler: RequestHandler) => {
    return new Route(url, matcher, handler);
  };

  private constructor(
    public readonly url: RouteUrl,
    public readonly matcher: RequestMatcher,
    public readonly handler: RequestHandler,
  ) {}
}
