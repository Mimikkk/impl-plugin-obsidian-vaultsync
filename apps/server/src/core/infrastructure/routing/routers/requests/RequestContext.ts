import type { HttpMethod } from "@nimir/shared";
import { RequestUrl } from "@server/core/infrastructure/routing/routers/requests/RequestUrl.ts";

export class RequestContext {
  static create(request: Request, method: HttpMethod, url: RequestUrl, parameters: URLSearchParams) {
    return new RequestContext(request, method, url, parameters);
  }

  private constructor(
    public readonly original: Request,
    public readonly method: HttpMethod,
    public readonly url: RequestUrl,
    public readonly parameters: URLSearchParams,
  ) {}

  static fromRequest(request: Request) {
    const url = new URL(request.url);
    const method = request.method as HttpMethod;

    return RequestContext.create(request, method, RequestUrl.fromUrl(url), new URLSearchParams(url.search));
  }
}
