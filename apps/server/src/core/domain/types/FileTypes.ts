import type { DateInit } from "@nimir/shared";

export enum FileType {
  Remote = "remote",
  Local = "local",
}

export interface FileInfo {
  path: string;
  updatedAt: number;
  type: FileType;
}

export interface FileMeta {
  deleted: boolean;
  deletedAt: DateInit;
}
