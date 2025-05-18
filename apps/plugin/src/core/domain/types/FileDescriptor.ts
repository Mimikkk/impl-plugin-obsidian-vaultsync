import type { DateInit } from "@nimir/shared";

export type FileType = "remote" | "local";

export interface FileDescriptor {
  path: string;
  updatedAt: number;
  type: FileType;
}

export interface FileInfo {
  deleted: boolean;
  deletedAt: DateInit;
}
