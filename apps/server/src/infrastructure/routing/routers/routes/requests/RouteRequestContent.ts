import type { RequestContext } from "@server/infrastructure/routing/routers/requests/RequestContext.ts";

export class RouteRequestContent<P extends object | null> {
  static create<P extends Record<string, any>>(values: P): RouteRequestContent<P> {
    return new RouteRequestContent(values);
  }

  private constructor(
    public readonly values: P,
  ) {}

  static async fromRequestContext<P extends Record<string, any>>(
    request: RequestContext,
  ): Promise<RouteRequestContent<P>> {
    let values: P;
    try {
      const type = request.original.headers.get("Content-Type");

      if (!type) {
        values = {} as P;
      } else if (type.includes("application/json")) {
        values = await request.original.json();
      } else if (type.includes("multipart/form-data")) {
        const formData = await request.original.formData();
        values = Object.fromEntries(formData.entries()) as P;
      } else {
        values = {} as P;
      }
    } catch {
      values = {} as P;
    }

    return RouteRequestContent.create(values);
  }
}
