import type { Options as KyOptions } from "ky";
import ky, { HTTPError } from "ky";
import qs from "qs";
import type { Awaitable, Expand } from "../types/common";

type Provider<T = any> = (params: T) => T;
type MethodRecord = Record<string, Endpoint<any, any>>;

type SplitParams<TUrl extends string> = TUrl extends `${infer _}{${infer TParam}}${infer TSuffix}`
  ? [TParam, ...SplitParams<TSuffix>]
  : [];

type UrlParamsOf<T extends string[]> = T extends [] ? {} : { [K in T[number]]: string };
type PathParamsOf<T extends string> = UrlParamsOf<SplitParams<T>>;

type MethodOptionKeys<TPathParams, TSearchParams, TPayload> =
  | keyof TPathParams
  | Exclude<
      "params" | "payload",
      | (TSearchParams extends undefined ? "params" : never)
      | (TPayload extends undefined ? "payload" : never)
    >;

type MethodOptions<TPathParams, TSearchParams, TPayload> = Expand<{
  [K in MethodOptionKeys<TPathParams, TSearchParams, TPayload>]: K extends keyof TPathParams
    ? TPathParams[K]
    : K extends "params"
      ? TSearchParams
      : K extends "payload"
        ? TPayload
        : never;
}>;

type OptionsOf<
  TPath extends string,
  TParams extends Provider,
  TPayload extends Provider,
> = MethodOptions<PathParamsOf<TPath>, Parameters<TParams>[0], Parameters<TPayload>[0]>;

type KyProvider<TOptions> = (
  options: TOptions,
) => Omit<KyOptions, "prefix" | "method" | "searchParams" | "json" | "body"> | undefined;

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

type RequestPayloadOptions = Pick<KyOptions, "json" | "body">;

function payloadOptions(payload: unknown): RequestPayloadOptions {
  if (payload === undefined || payload === null) {
    return {};
  }

  if (payload instanceof FormData) {
    return { body: payload };
  }

  return { json: payload };
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || undefined;
}

export class Endpoint<TData, TOptions> {
  private constructor(
    private readonly method: "get" | "post" | "put" | "delete" | "patch",
    private readonly service: string,
    private readonly path: string,
    private readonly params: Provider | undefined,
    private readonly payload: Provider | undefined,
    private readonly result: Provider | undefined,
    private readonly ky: KyProvider<TOptions> | undefined,
    private readonly onSuccess: ((data: TData) => Awaitable<void> | undefined) | undefined,
    private readonly onError: ((error: HTTPError) => Awaitable<TData | undefined>) | undefined,
    private readonly binary: boolean,
  ) {}

  static from<TData, TOptions>(options: {
    method: "get" | "post" | "put" | "delete" | "patch";
    service: string;
    path: string;
    params?: Provider;
    payload?: Provider;
    result?: Provider;
    ky?: KyProvider<TOptions>;
    onSuccess?: (data: TData) => Awaitable<void>;
    onError?: (error: HTTPError) => Awaitable<TData | undefined>;
    binary?: boolean;
  }): Endpoint<TData, TOptions> {
    return new Endpoint(
      options.method,
      options.service,
      options.path,
      options.params,
      options.payload,
      options.result,
      options.ky,
      options.onSuccess,
      options.onError,
      options.binary ?? false,
    );
  }

  url(options: Omit<TOptions, "params" | "payload">): string {
    return joinUrl(this.service, this.path).replace(
      /{([^}]+)}/g,
      (_, key) => options[key as keyof Omit<TOptions, "params" | "payload">] as string,
    );
  }

  async fetch(options: TOptions): Promise<TData> {
    const url = this.url(options);

    const searchParams = this.params
      ? qs.stringify(this.params((options as { params: unknown }).params))
      : undefined;
    const payload = this.payload?.((options as { payload: unknown }).payload);

    const requestOptions: KyOptions = {
      throwHttpErrors: true,
      ...this.ky?.(options),
      ...(searchParams != null ? { searchParams: searchParams as KyOptions["searchParams"] } : {}),
      ...(this.method !== "get" ? payloadOptions(payload) : {}),
    };

    try {
      const response = await ky[this.method](url, requestOptions);
      const raw = this.binary ? await response.arrayBuffer() : await parseResponse(response);
      const result = (this.result?.(raw ?? response) ?? raw ?? response) as TData;

      await this.onSuccess?.(result);

      return result;
    } catch (error) {
      if (error instanceof HTTPError && this.onError) {
        return (await this.onError(error)) as TData;
      }

      throw error;
    }
  }
}

class Types {
  static file(file: File): FormData {
    const form = new FormData();
    form.append("file", file);
    return form;
  }

  static shape<T>(data: T): T {
    return data;
  }

  static datalist<T>({ data }: { data: T[] }): T[] {
    return data;
  }

  static data<T>({ data }: { data: T }): T {
    return data;
  }
}

interface EndpointOptions<
  TPath extends string,
  TResult extends Provider,
  TParams extends Provider,
  TPayload extends Provider,
> {
  path: TPath;
  result?: TResult;
  params?: TParams;
  payload?: TPayload;
  useSuccessMessage?: boolean;
  onSuccess?: (data: ReturnType<TResult>) => Awaitable<void>;
  onError?: (error: HTTPError) => Awaitable<ReturnType<TResult> | undefined>;
  ky?: KyProvider<OptionsOf<TPath, TParams, TPayload>>;
  binary?: boolean;
}

class Methods {
  private constructor(private readonly service: string) {}

  static from(service: string): Methods {
    return new Methods(service);
  }

  get<
    TPath extends string,
    TResult extends Provider,
    TParams extends Provider = Provider<undefined>,
    TPayload extends Provider = Provider<undefined>,
  >(
    options: EndpointOptions<TPath, TResult, TParams, TPayload>,
  ): Endpoint<ReturnType<TResult>, OptionsOf<TPath, TParams, TPayload>> {
    return Endpoint.from({ method: "get", service: this.service, ...options });
  }

  post<
    TPath extends string,
    TResult extends Provider = Provider<unknown>,
    TParams extends Provider = Provider<undefined>,
    TPayload extends Provider = Provider<undefined>,
  >(
    options: EndpointOptions<TPath, TResult, TParams, TPayload>,
  ): Endpoint<ReturnType<TResult>, OptionsOf<TPath, TParams, TPayload>> {
    return Endpoint.from({ method: "post", service: this.service, ...options });
  }

  put<
    TPath extends string,
    TResult extends Provider = Provider<unknown>,
    TParams extends Provider = Provider<undefined>,
    TPayload extends Provider = Provider<undefined>,
  >(
    options: EndpointOptions<TPath, TResult, TParams, TPayload>,
  ): Endpoint<ReturnType<TResult>, OptionsOf<TPath, TParams, TPayload>> {
    return Endpoint.from({ method: "put", service: this.service, ...options });
  }

  delete<
    TPath extends string,
    TResult extends Provider = Provider<unknown>,
    TParams extends Provider = Provider<undefined>,
    TPayload extends Provider = Provider<undefined>,
  >(
    options: EndpointOptions<TPath, TResult, TParams, TPayload>,
  ): Endpoint<ReturnType<TResult>, OptionsOf<TPath, TParams, TPayload>> {
    return Endpoint.from({ method: "delete", service: this.service, ...options });
  }

  patch<
    TPath extends string,
    TResult extends Provider = Provider<unknown>,
    TParams extends Provider = Provider<undefined>,
    TPayload extends Provider = Provider<undefined>,
  >(
    options: EndpointOptions<TPath, TResult, TParams, TPayload>,
  ): Endpoint<ReturnType<TResult>, OptionsOf<TPath, TParams, TPayload>> {
    return Endpoint.from({ method: "patch", service: this.service, ...options });
  }
}

interface MethodsContext {
  types: typeof Types;
  methods: Methods;
}

interface InferMethod<TMethod extends Provider> {
  options: Parameters<TMethod>[0];
  payload: Parameters<TMethod>[0]["payload"];
  params: Parameters<TMethod>[0]["params"];
  result: Awaited<ReturnType<TMethod>>;
}

type InferMethods<TMethods extends MethodRecord> = {
  [TMethodName in keyof TMethods]: InferMethod<TMethods[TMethodName]["fetch"]>;
};

type Client<TMethods extends MethodRecord> = Expand<TMethods & { $infer: InferMethods<TMethods> }>;

interface ClientOptions<TMethods extends MethodRecord> {
  service: string;
  methods: (context: MethodsContext) => TMethods;
}

export function defineClient<TMethods extends MethodRecord>(
  options: ClientOptions<TMethods>,
): Client<TMethods> {
  return options.methods({
    types: Types,
    methods: Methods.from(options.service),
  }) as never;
}
