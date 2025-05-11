import type { RequestContext } from "@server/infrastructure/routing/routers/requests/RequestContext.ts";

export interface RequestMatcher {
  matches(request: RequestContext): boolean;
}
