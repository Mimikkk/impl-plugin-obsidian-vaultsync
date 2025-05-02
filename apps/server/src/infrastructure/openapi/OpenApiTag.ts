import { TagObject } from "openapi3-ts/oas31";

export enum OpenApiTag {
  Instruction = "Instruction (internal)",
  Documentation = "Documentation (internal)",
  Static = "Static (internal)",
}

export const OpenApiTags = new Map<OpenApiTag, TagObject>([
  [OpenApiTag.Instruction, {
    name: OpenApiTag.Instruction,
    description: "instructions to setup the server connection",
  }],
  [OpenApiTag.Documentation, {
    name: OpenApiTag.Documentation,
    description: "documentation for the server api",
  }],
  [OpenApiTag.Static, {
    name: OpenApiTag.Static,
    description: "static files",
  }],
]);
export const OpenApiTagOrder = new Map<OpenApiTag, number>([
  OpenApiTag.Instruction,
  OpenApiTag.Documentation,
  OpenApiTag.Static,
].map((item, index) => [item, index]));
