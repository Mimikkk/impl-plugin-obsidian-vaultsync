import type { OpenApiTag } from "@server/core/infrastructure/openapi/OpenApiTag.ts";
import type { OpenApiResponseNs } from "@server/core/infrastructure/openapi/decorators/OpenApiResponseNs.ts";
import type { RequestContent } from "@server/core/presentation/messaging/http/content/RequestContent.ts";
import type { QueryParameter } from "@server/core/presentation/messaging/http/parameters/QueryParameter.ts";
import type { RouteParameter } from "@server/core/presentation/messaging/http/parameters/RouteParameter.ts";

export namespace OpenApiRouteNs {
  const symbol = Symbol("OpenapiRouteMeta");
  export interface Meta {
    [symbol]: Spec;
  }
  export const is = (value: any): value is Meta => Object.hasOwn(value, symbol);
  export const meta = (value: Meta): Spec => value[symbol];
  export const get = (value: any): Spec | undefined => is(value) ? meta(value) : undefined;

  export interface Spec {
    summary: string;
    description: string;
    tags: OpenApiTag[];
    responses: OpenApiResponseNs.Meta[];
    deprecated: boolean;
    routeParameters: RouteParameter[];
    queryParameters: QueryParameter[];
    content?: RequestContent;
  }

  export interface Options {
    summary: string;
    description: string;
    tags: OpenApiTag[];
    responses?: OpenApiResponseNs.Meta[];
    deprecated?: boolean;
    routeParameters?: RouteParameter[];
    queryParameters?: QueryParameter[];
    content?: RequestContent;
  }

  export const decorate =
    ({ summary, description, tags, responses, deprecated, routeParameters, queryParameters, content }: Options) =>
    (target: any) => {
      target[symbol] = {
        summary,
        description,
        tags,
        responses: responses ?? [],
        deprecated: deprecated ?? false,
        routeParameters: routeParameters ?? [],
        queryParameters: queryParameters ?? [],
        content,
      } satisfies Spec;
    };
}
