import type { FileDescriptor } from "@plugin/domain/types/FileDescriptor.ts";
import type { TAbstractFile, TFile, TFolder } from "obsidian";

export namespace LocalFileSystemClient {
  const fs = globalThis.app.vault;

  export const isEntry = (path: string): boolean => getEntry(path) !== null;
  export const isFile = (path: string): boolean => getFile(path) !== null;
  export const isFolder = (path: string): boolean => getFolder(path) !== null;

  export const getEntry = (path: string): TAbstractFile | null => fs.getAbstractFileByPath(path);
  export const getFile = (path: string): TFile | null => fs.getFileByPath(path);
  export const getFolder = (path: string): TFolder | null => fs.getFolderByPath(path);

  export const read = async (path: string): Promise<ArrayBuffer | null> => {
    const file = getFile(path);
    if (!file) return null;

    return await fs.readBinary(file);
  };
  export const remove = (path: string) => {
    const file = getFile(path);
    if (!file) return;

    return fs.delete(file);
  };

  /** @see {@link https://help.obsidian.md/file-formats | Obsidian File Formats (www)} */
  export const isValid = (path: string): boolean => {
    if (isFile(path)) return true;

    const e = path.substring(path.lastIndexOf(".") + 1);
    return e === "md" || e === "canvas" || e === "pdf" ||
      e === "avif" || e === "bmp" || e === "gif" || e === "jpeg" || e === "jpg" || e === "png" ||
      e === "svg" || e === "webp" ||
      e === "flac" || e === "m4a" || e === "mp3" || e === "ogg" || e === "wav" || e === "webm" || e === "3gp" ||
      e === "mkv" ||
      e === "mov" || e === "mp4" || e === "ogv" || e === "webm";
  };

  export const folderOf = (path: string) => {
    const lastSlashIndex = path.lastIndexOf("/");
    return lastSlashIndex > 0 ? path.substring(0, lastSlashIndex) : "";
  };

  export const createFolder = (path: string) => fs.createFolder(path);
  export const maybeCreateFolder = (path: string) => {
    if (!path) return;
    if (isFolder(path)) return;

    return createFolder(path);
  };

  export const update = async (path: string, content: ArrayBuffer) => {
    await maybeCreateFolder(folderOf(path));

    const file = getFile(path);
    if (file) {
      fs.modifyBinary(file, content);
      return file;
    } else {
      return fs.createBinary(path, content);
    }
  };

  export const list = (): FileDescriptor[] => {
    const files = fs.getFiles();

    return files.map((file) => ({ path: file.path, updatedAt: file.stat.mtime }));
  };
}
