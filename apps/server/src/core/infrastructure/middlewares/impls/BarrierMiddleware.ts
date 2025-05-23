import type { Awaitable } from "@nimir/shared";
import type { Dispatch, Middleware } from "@server/core/infrastructure/middlewares/Middleware.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";

export class BarrierMiddleware implements Middleware {
  static create(): BarrierMiddleware {
    return new BarrierMiddleware();
  }

  private constructor() {}

  handle(request: Request, next: Dispatch): Awaitable<Response> {
    try {
      return next(request);
    } catch (error) {
      return HttpJsonResponse.internal(error);
    }
  }
}
