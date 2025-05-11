import type { Awaitable } from "@nimir/shared";
import type { Controller, ControllerFn, ControllerKey } from "../../controllers/ControllerTypes.ts";
import type { RouteRequestContext } from "../routes/requests/RouteRequestContext.ts";
import type { RequestHandler } from "./RequestHandler.ts";

export class RequestControllerHandler<
  C extends Controller = Controller,
  H extends ControllerKey<C> = ControllerKey<C>,
> implements RequestHandler {
  static create<C extends Controller, H extends ControllerKey<C>>(
    controller: C,
    handler: H,
  ): RequestControllerHandler<C, H> {
    return new RequestControllerHandler(controller, handler);
  }

  private constructor(
    public readonly controller: C,
    public readonly handler: H,
  ) {}

  handle(context: RouteRequestContext): Awaitable<Response> {
    const method = this.controller[this.handler] as ControllerFn;
    return method.bind(this.controller)(context);
  }
}
