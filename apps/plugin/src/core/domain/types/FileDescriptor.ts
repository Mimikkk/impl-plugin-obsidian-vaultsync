export type FileType = "remote" | "local";

export interface FileDescriptor {
  path: string;
  updatedAt: number;
  type: FileType;
}
