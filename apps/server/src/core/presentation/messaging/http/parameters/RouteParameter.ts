import type { ParameterObject, SchemaObject } from "openapi3-ts/oas31";

export class RouteParameter {
  static create({ name, example, description, type, format, options }: RouteParameterNs.Options): RouteParameter {
    return new RouteParameter(name, example, description, type, format, options);
  }

  static integer(
    { name, options, example = options?.[0] ?? "1", description }: RouteParameterNs.IntegerOptions,
  ): RouteParameter {
    return this.create({ name, example, description, type: "integer", format: "int32", options });
  }

  static string(
    { name, options, example = options?.[0] ?? "text", description }: RouteParameterNs.StringOptions,
  ): RouteParameter {
    return this.create({ name, example, description, type: "string", options });
  }

  static number(
    { name, options, example = options?.[0] ?? "1.0", description }: RouteParameterNs.NumberOptions,
  ): RouteParameter {
    return this.create({ name, example, description, type: "number", format: "float", options });
  }

  static boolean(
    { name, options, example = options?.[0] ?? "true", description }: RouteParameterNs.BooleanOptions,
  ): RouteParameter {
    return this.create({ name, example, description, type: "boolean", options });
  }

  private constructor(
    public readonly name: string,
    public readonly example: string,
    public readonly description: string,
    public readonly type: SchemaObject["type"],
    public readonly format: SchemaObject["format"],
    public readonly options: string[] | undefined,
  ) {}

  toString(): string {
    return `{${this.name}:${this.type}}`;
  }

  toObject(): ParameterObject {
    return {
      name: `${this.name}:${this.type}`,
      example: this.example,
      description: this.description,
      schema: { type: this.type, format: this.format, enum: this.options },
      in: "path",
      required: true,
    };
  }
}

export namespace RouteParameterNs {
  export interface Options {
    name: string;
    example: string;
    description: string;
    type: SchemaObject["type"];
    format?: SchemaObject["format"];
    options?: string[];
  }

  export interface IntegerOptions {
    name: string;
    example?: string;
    description: string;
    options?: string[];
  }

  export interface StringOptions {
    name: string;
    example?: string;
    description: string;
    options?: string[];
  }

  export interface NumberOptions {
    name: string;
    example?: string;
    description: string;
    options?: string[];
  }

  export interface BooleanOptions {
    name: string;
    example?: string;
    description: string;
    options?: string[];
  }
}
