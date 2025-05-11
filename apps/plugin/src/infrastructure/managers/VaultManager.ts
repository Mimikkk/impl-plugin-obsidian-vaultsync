import type { TAbstractFile, TFile, TFolder } from "obsidian";

export namespace VaultManager {
  const fs = globalThis.app.vault;

  export const isEntry = (path: string): boolean => getEntry(path) !== null;
  export const isFile = (path: string): boolean => getFile(path) !== null;
  export const isFolder = (path: string): boolean => getFolder(path) !== null;

  export const getEntry = (path: string): TAbstractFile | null => fs.getAbstractFileByPath(path);
  export const getFile = (path: string): TFile | null => fs.getFileByPath(path);
  export const getFolder = (path: string): TFolder | null => fs.getFolderByPath(path);

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
    const updatedAt = [file?.stat.mtime, file?.stat.ctime];
    console.log({ file, updatedAt });

    if (file) {
      // if (file.stat.mtime === content) return;

      return fs.modifyBinary(file, content);
    } else {
      return fs.createBinary(path, content);
    }
  };
}
