import type { RequestContext } from "@server/core/infrastructure/routing/routers/requests/RequestContext.ts";

export interface RequestMatcher {
  matches(request: RequestContext): boolean;
}
