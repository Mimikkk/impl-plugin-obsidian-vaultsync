import { ControllerNs } from "@server/core/infrastructure/routing/routes/decorators/ControllerNs.ts";
import "@server/features/documentation/presentation/controllers/http/HttpDocumentationController.ts";
import "@server/features/events/presentation/controllers/http/HttpEventController.ts";
import "@server/features/health/presentation/controllers/http/HttpHealthController.ts";
import "@server/features/static/presentation/controllers/http/HttpStaticController.ts";
import "../../../../features/filesystem/presentation/controllers/http/HttpFileOperationsController.ts";
import "../../../../features/filesystem/presentation/controllers/http/HttpFileSearchController.ts";
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
