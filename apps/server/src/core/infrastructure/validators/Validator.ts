import type { Schema } from "@server/core/infrastructure/validators/Schema.ts";
import type { ValidationError } from "@server/core/infrastructure/validators/ValidationError.ts";

export interface Validator<P extends Schema> {
  validate(values: unknown): P | ValidationError[];
}
