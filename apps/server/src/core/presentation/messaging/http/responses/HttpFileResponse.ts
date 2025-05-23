import { HttpResponse } from "@server/core/presentation/messaging/http/responses/HttpResponse.ts";
import type { SchemaObject } from "openapi3-ts/oas31";

export namespace HttpFileResponse {
  export const headers = { "Content-Type": "application/octet-stream" } as const;

  export interface CustomOptions<Fn extends (...args: any[]) => any> {
    example: ReturnType<Fn>;
    name: string;
    status: number;
    description: string;
    schema: SchemaObject;
  }

  export const custom = <const Fn extends (...args: any[]) => any>({
    example,
    description,
    schema,
    status,
  }: CustomOptions<Fn>) =>
    HttpResponse.custom({
      content: (file: Uint8Array) => file,
      headers,
      spec: { status, description, content: { "application/octet-stream": { schema, example } } },
    });
}
