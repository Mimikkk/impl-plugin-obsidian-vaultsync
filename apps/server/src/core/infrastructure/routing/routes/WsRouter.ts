import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import { WsRouterBuilder } from "../routers/protocols/ws/WsRouterBuilder.ts";

const builder = WsRouterBuilder.create();

for (const Controller of ControllerNs.list) {
  const { routes } = ControllerNs.meta(Controller);

  for (const route of routes) {
    if (route.type !== "ws") continue;

    builder.ws({ path: route.path, Controller, handler: route.name });
  }
}

export const WsRouter = builder.build();
