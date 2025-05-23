import { type FileInfo, FileType } from "@nimir/shared";
import type { TAbstractFile, TFile, TFolder } from "obsidian";

import { singleton } from "@nimir/framework";

@singleton
export class LocalFileSystemClient {
  static create() {
    return new LocalFileSystemClient();
  }

  private constructor(
    private readonly fs = globalThis.app.vault,
  ) {}

  isFile(path: string): boolean {
    return this.getFile(path) !== null;
  }

  isFolder(path: string): boolean {
    return this.getFolder(path) !== null;
  }
  getEntry(path: string): TAbstractFile | null {
    return this.fs.getAbstractFileByPath(path);
  }

  getFile(path: string): TFile | null {
    return this.fs.getFileByPath(path);
  }

  getFolder(path: string): TFolder | null {
    return this.fs.getFolderByPath(path);
  }

  /** @see {@link https://help.obsidian.md/file-formats | Obsidian File Formats (www)} */
  isValid(path: string): boolean {
    if (this.isFile(path)) return true;

    const e = path.substring(path.lastIndexOf(".") + 1);
    return e === "md" || e === "canvas" || e === "pdf" ||
      e === "avif" || e === "bmp" || e === "gif" || e === "jpeg" || e === "jpg" || e === "png" ||
      e === "svg" || e === "webp" ||
      e === "flac" || e === "m4a" || e === "mp3" || e === "ogg" || e === "wav" || e === "webm" || e === "3gp" ||
      e === "mkv" ||
      e === "mov" || e === "mp4" || e === "ogv" || e === "webm";
  }

  folderOf(path: string) {
    const lastSlashIndex = path.lastIndexOf("/");
    return lastSlashIndex > 0 ? path.substring(0, lastSlashIndex) : "";
  }

  createFolder(path: string) {
    return this.fs.createFolder(path);
  }

  async maybeCreateFolder(path: string) {
    if (!path) return;
    if (this.isFolder(path)) return;

    return await this.createFolder(path);
  }

  async read(path: string): Promise<ArrayBuffer | undefined> {
    const file = this.getFile(path);
    if (!file) return undefined;

    return await this.fs.readBinary(file);
  }

  async remove(path: string) {
    const file = this.getFile(path);
    if (!file) return;

    return await this.fs.delete(file);
  }

  async update(path: string, content: ArrayBuffer) {
    await this.maybeCreateFolder(this.folderOf(path));

    const file = this.getFile(path);
    if (file) {
      this.fs.modifyBinary(file, content);
      return file;
    } else {
      return this.fs.createBinary(path, content);
    }
  }

  list(): FileInfo[] {
    const files = this.fs.getFiles();

    return files.map((file) => ({ path: file.path, updatedAt: file.stat.mtime, type: FileType.Local }));
  }
}
