import { readFile } from "node:fs/promises";
import { extname } from "node:path";

export class FileReader {
  static create(): FileReader {
    return new FileReader();
  }

  async read<T extends FileReader.FileType>(
    path: string,
    type: T,
  ): Promise<FileReader.FileMap[T] | undefined> {
    try {
      if (type === "string") {
        return (await readFile(path, "utf8")) as FileReader.FileMap[T];
      }

      return new Uint8Array(await readFile(path)) as FileReader.FileMap[T];
    } catch {
      return undefined;
    }
  }

  readStr(path: string): Promise<string | undefined> {
    return this.read(path, "string");
  }

  readU8(path: string): Promise<Uint8Array | undefined> {
    return this.read(path, "uint8");
  }

  mime(path: string): string {
    const extension = extname(path);

    return Bun.file(`file${extension}`).type || "application/octet-stream";
  }
}

export namespace FileReader {
  export type FileMap = {
    string: string;
    uint8: Uint8Array;
  };

  export type FileType = keyof FileMap;
}
