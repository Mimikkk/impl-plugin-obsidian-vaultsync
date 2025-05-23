import type { TagObject } from "openapi3-ts/oas31";

export enum OpenApiTag {
  Events = "Events",
  Files = "Files",
  FileSystem = "FileSystem",
  Health = "Health",
  Documentation = "Documentation (internal)",
  Static = "Static (internal)",
}

export const OpenApiTags = new Map<OpenApiTag, TagObject>([
  [OpenApiTag.Events, {
    name: OpenApiTag.Events,
    description: "events of the server",
  }],
  [OpenApiTag.Files, {
    name: OpenApiTag.Files,
    description: "files of the server",
  }],
  [OpenApiTag.FileSystem, {
    name: OpenApiTag.FileSystem,
    description: "filesystem",
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

export const OpenApiTagOrder = new Map<OpenApiTag, number>([
  OpenApiTag.FileSystem,
  OpenApiTag.Health,
  OpenApiTag.Documentation,
  OpenApiTag.Static,
].map((item, index) => [item, index]));
