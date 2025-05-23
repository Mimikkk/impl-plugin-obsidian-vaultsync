import type { Awaitable } from "@nimir/shared";
import type { Dispatch, Middleware } from "@server/core/infrastructure/middlewares/Middleware.ts";

interface RedirectOptions {
  from: string;
  to: string;
  with?: HeadersInit;
}

export interface RedirectMiddlewareOptions {
  redirects: RedirectOptions[];
}

interface Redirect {
  from: string;
  to: string;
  headers?: HeadersInit;
  wildcard: boolean;
  external: boolean;
}

export class RedirectMiddleware implements Middleware {
  static create({ redirects }: RedirectMiddlewareOptions): RedirectMiddleware {
    const wildcards: Redirect[] = [];
    const exacts = new Map<string, Redirect>();

    for (const { from, to, with: headers } of redirects) {
      const isWildcard = from.endsWith("/*");
      const isExternal = to.startsWith("http");

      if (isWildcard) {
        wildcards.push({
          from: from.slice(0, -2),
          to: to.slice(0, -2),
          headers,
          wildcard: true,
          external: isExternal,
        });
      } else {
        exacts.set(from, {
          from,
          to,
          headers,
          wildcard: false,
          external: isExternal,
        });
      }
    }

    return new RedirectMiddleware(exacts, wildcards);
  }

  private constructor(
    private readonly exacts: Map<string, Redirect>,
    private readonly wildcards: Redirect[],
  ) {}

  private find(pathname: string): Redirect | undefined {
    const exact = this.exacts.get(pathname);
    if (exact) return exact;

    const wildcard = this.wildcards.find(({ from }) => pathname.startsWith(from));
    if (wildcard) return wildcard;

    return undefined;
  }

  handle(request: Request, next: Dispatch): Awaitable<Response> {
    const url = new URL(request.url);

    const redirect = this.find(url.pathname);
    if (redirect) {
      const { from, to, headers, wildcard, external } = redirect;

      let location = to;

      if (external) {
        location = to;
      } else {
        location = `${url.origin}${to}`;
      }

      if (wildcard) {
        location = `${to}${url.pathname.slice(from.length)}${url.search}`;
      }

      const newHeaders = new Headers(request.headers);
      for (const [key, value] of Object.entries(headers ?? {})) {
        newHeaders.set(key, value);
      }

      request = new Request(location, {
        body: request.body,
        cache: request.cache,
        credentials: request.credentials,
        method: request.method,
        mode: request.mode,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        integrity: request.integrity,
        keepalive: request.keepalive,
        signal: request.signal,
        headers: newHeaders,
      });

      if (external) {
        return fetch(request);
      }
    }

    return next(request);
  }
}
