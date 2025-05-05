import type { ParameterObject, SchemaObject } from "openapi3-ts/oas31";

export class QueryParameter {
  static create({ name, example, description, type, format, options }: QueryParameterNs.Options): QueryParameter {
    return new QueryParameter(name, example, description, type, format, options);
  }

  static string(
    { name, options, example = options?.[0] ?? "text", description }: QueryParameterNs.StringOptions,
  ): QueryParameter {
    return this.create({ name, example, description, type: "string", options });
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
      name: this.name,
      example: this.example,
      description: this.description,
      schema: { type: this.type, format: this.format, enum: this.options },
      in: "query",
      required: true,
    };
  }
}

export namespace QueryParameterNs {
  export interface Options {
    name: string;
    example: string;
    description: string;
    type: SchemaObject["type"];
    format?: SchemaObject["format"];
    options?: string[];
  }

  export interface StringOptions {
    name: string;
    example?: string;
    description: string;
    options?: string[];
  }
}
