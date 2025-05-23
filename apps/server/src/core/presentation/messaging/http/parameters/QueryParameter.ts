import type { ParameterObject, SchemaObject } from "openapi3-ts/oas31";

export class QueryParameter {
  static create(
    { name, example, description, type, format, options, required }: QueryParameterNs.Options,
  ): QueryParameter {
    return new QueryParameter(name, example, description, type, format, options, required);
  }

  static string(
    { name, options, example = options?.[0] ?? "text", description, required }: QueryParameterNs.StringOptions,
  ): QueryParameter {
    return this.create({ name, example, description, type: "string", options, required });
  }

  static boolean({ name, example = true, description }: QueryParameterNs.BooleanOptions): QueryParameter {
    return this.create({ name, example: `${example}`, description, type: "boolean" });
  }

  static integer({ name, example = 0, description, required }: QueryParameterNs.IntegerOptions): QueryParameter {
    return this.create({ name, example: `${example}`, description, type: "integer", required });
  }

  static number({ name, example = 0, description, required }: QueryParameterNs.NumberOptions): QueryParameter {
    return this.create({ name, example: `${example}`, description, type: "number", required });
  }

  static strings(
    { name, example = [], description, required, options }: QueryParameterNs.StringsOptions,
  ): QueryParameter {
    return this.create({ name, example: `${example}`, description, type: "array", required, options });
  }

  private constructor(
    public readonly name: string,
    public readonly example: string,
    public readonly description: string,
    public readonly type: SchemaObject["type"],
    public readonly format: SchemaObject["format"],
    public readonly options: string[] | undefined,
    public readonly required: boolean = false,
  ) {}

  toString(): string {
    return this.name;
  }

  toObject(): ParameterObject {
    const schema: SchemaObject = { type: this.type, format: this.format };

    if (this.type === "array") {
      schema.items = { type: "string", enum: this.options };
    } else {
      schema.enum = this.options;
    }

    return {
      name: this.name,
      example: this.example,
      description: this.description,
      schema,
      in: "query",
      explode: false,
      required: this.required,
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
    required?: boolean;
  }

  export interface IntegerOptions {
    name: string;
    example?: number;
    description: string;
    required?: boolean;
  }

  export interface NumberOptions {
    name: string;
    example?: number;
    description: string;
    required?: boolean;
  }

  export interface StringOptions {
    name: string;
    example?: string;
    description: string;
    options?: string[];
    required?: boolean;
  }

  export interface BooleanOptions {
    name: string;
    example?: boolean;
    description: string;
    required?: boolean;
  }

  export interface StringsOptions {
    name: string;
    example?: string[];
    description: string;
    options?: string[];
    required?: boolean;
  }
}
