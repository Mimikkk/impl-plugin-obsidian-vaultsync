import type { Awaitable } from "@nimir/shared";
import type { Dispatch, Middleware } from "@server/core/infrastructure/middlewares/Middleware.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";

export interface TimeoutMiddlewareOptions {
  timeoutMs: number;
  exceptions?: { path: string; timeoutMs: number }[];
}

export class TimeoutMiddleware implements Middleware {
  static create({ timeoutMs, exceptions = [] }: TimeoutMiddlewareOptions): TimeoutMiddleware {
    return new TimeoutMiddleware(timeoutMs, exceptions);
  }

  private constructor(
    private readonly timeoutMs: number,
    private readonly exceptions: { path: string; timeoutMs: number }[],
  ) {}

  handle(request: Request, next: Dispatch): Awaitable<Response> {
    const timeoutMs = this.exceptions.find(({ path }) => request.url.includes(path))?.timeoutMs ?? this.timeoutMs;

    const timeout = new Promise<Response>((resolve) =>
      setTimeout(() => resolve(HttpJsonResponse.timeout()), timeoutMs)
    );

    return Promise.race([next(request), timeout]);
  }
}
