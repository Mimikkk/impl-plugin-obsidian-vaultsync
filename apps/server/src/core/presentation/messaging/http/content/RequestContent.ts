import type { RequestBodyObject, SchemaObject } from "openapi3-ts/oas31";

export class RequestContent<T = object> {
  static create<T>(
    { name, example, description, properties, type, required }: RequestContent.Options<T>,
  ): RequestContent<T> {
    return new RequestContent(name, example, description, properties, type, required);
  }

  private constructor(
    public readonly name: string,
    public readonly example: T,
    public readonly description: string,
    public readonly properties: Record<keyof T, SchemaObject>,
    public readonly type: string = "application/json",
    public readonly required: string[] = [],
  ) {}

  toObject(): RequestBodyObject {
    return {
      description: this.description,
      required: true,
      content: {
        [this.type]: {
          example: this.example,
          schema: {
            type: "object",
            properties: this.properties,
            required: this.required,
          },
        },
      },
    };
  }
}

export namespace RequestContent {
  export interface Options<T> {
    name: string;
    example: T;
    description: string;
    properties: Record<keyof T, SchemaObject>;
    type?: string;
    required?: string[];
  }
}
