import type { Awaitable } from "@nimir/shared";

export type Dispatch = (request: Request) => Awaitable<Response>;
export interface Middleware {
  handle(request: Request, next: Dispatch): Awaitable<Response>;
}
