import type { TagObject } from "openapi3-ts/oas31";

export enum OpenApiTag {
  FileSystem = "FileSystem",
  Health = "Health",
  Documentation = "Documentation (internal)",
  Static = "Static (internal)",
}

export const OpenApiTags = new Map<OpenApiTag, TagObject>([
  [OpenApiTag.FileSystem, {
    name: OpenApiTag.FileSystem,
    description: "file system",
  }],
  [OpenApiTag.Health, {
    name: OpenApiTag.Health,
    description: "health of the server",
  }],
  [OpenApiTag.Documentation, {
    name: OpenApiTag.Documentation,
    description: "documentation for the server API",
  }],
  [OpenApiTag.Static, {
    name: OpenApiTag.Static,
    description: "static files",
  }],
]);

export const OpenApiTagOrder = new Map<OpenApiTag, number>(
  Object.keys(OpenApiTags).map((item, index) => [item as OpenApiTag, index]),
);
