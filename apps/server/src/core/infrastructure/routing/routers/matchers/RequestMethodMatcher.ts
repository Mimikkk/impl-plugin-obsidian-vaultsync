import type { HttpMethod } from "@nimir/shared";
import type { RequestContext } from "@server/core/infrastructure/routing/routers/requests/RequestContext.ts";
import type { RequestMatcher } from "./RequestMatcher.ts";

export class RequestMethodMatcher implements RequestMatcher {
  static create(method: HttpMethod): RequestMethodMatcher {
    return new RequestMethodMatcher(method);
  }

  private constructor(public readonly method: HttpMethod) {}

  matches(request: RequestContext): boolean {
    return request.method === this.method;
  }
}
