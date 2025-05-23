import type { DateInit } from "@nimir/shared";

export enum FileType {
  Remote = "remote",
  Local = "local",
}

export interface FileDescriptor {
  path: string;
  updatedAt: number;
  type: FileType;
}

export interface FileInfo {
  deleted: boolean;
  deletedAt: DateInit;
}
