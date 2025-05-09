import { ControllerNs } from "@server/infrastructure/routing/routes/decorators/ControllerNs.ts";
import "@server/modules/documentation/presentation/controllers/http/HttpDocumentationController.ts";
import "@server/modules/filesystem/presentation/controllers/http/HttpFileSystemController.ts";
import "@server/modules/health/presentation/controllers/http/HealthController.ts";
import "@server/modules/static/presentation/controllers/http/HttpStaticController.ts";
import { HttpRouterBuilder } from "../routers/protocols/http/HttpRouterBuilder.ts";

const builder = HttpRouterBuilder.create();

for (const Controller of ControllerNs.list) {
  const { routes } = ControllerNs.meta(Controller);

  for (const route of routes) {
    if (route.type !== "http") continue;

    builder.add({ Controller, method: route.method, path: route.path, handler: route.name });
  }
}

export const HttpRouter = builder.build();
