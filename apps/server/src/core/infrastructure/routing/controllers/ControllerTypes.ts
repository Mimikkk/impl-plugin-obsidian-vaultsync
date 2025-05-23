import type { Awaitable, TypeKey } from "@nimir/shared";
import type { RouteRequestContext } from "@server/core/infrastructure/routing/routers/routes/requests/RouteRequestContext.ts";

export type ControllerFn<C extends RouteRequestContext = RouteRequestContext> = (
  context: C,
) => Awaitable<Response>;

export interface ControllerClass<C = any> {
  create(...args: any[]): C;
}

export type Controller<C extends ControllerClass = ControllerClass> = ReturnType<C["create"]>;

export type ControllerKey<C extends Controller = Controller> = TypeKey<C, ControllerFn<any>>;
