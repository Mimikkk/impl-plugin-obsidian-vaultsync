import type { Awaitable, FileInfo, FileMeta } from "@nimir/shared";

export interface FileSearch {
  list(): Awaitable<FileInfo[]>;
  meta(path: string): Awaitable<FileMeta | undefined>;
}

export interface FileOperations {
  download(path: string): Awaitable<ArrayBuffer | undefined>;
  upload(path: string, content: ArrayBuffer): Awaitable<void>;
  delete(path: string): Awaitable<void>;
}

export class Filesystem implements FileSearch, FileOperations {
  static create(
    search: FileSearch,
    operations: FileOperations,
  ) {
    return new Filesystem(search, operations);
  }

  private constructor(
    private readonly search: FileSearch,
    private readonly operations: FileOperations,
  ) {}

  async download(path: string): Promise<ArrayBuffer | undefined> {
    return await this.operations.download(path);
  }

  async upload(path: string, content: ArrayBuffer): Promise<void> {
    return await this.operations.upload(path, content);
  }

  async delete(path: string): Promise<void> {
    return await this.operations.delete(path);
  }

  async list(): Promise<FileInfo[]> {
    return await this.search.list();
  }

  async meta(path: string): Promise<FileMeta | undefined> {
    return await this.search.meta(path);
  }
}
