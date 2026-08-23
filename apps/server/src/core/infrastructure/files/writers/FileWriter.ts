import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export class FileWriter {
  static create(): FileWriter {
    return new FileWriter();
  }

  async write(path: string, content: string | Uint8Array): Promise<boolean> {
    try {
      const directory = dirname(path);

      if (directory) {
        try {
          await mkdir(directory, { recursive: true });
        } catch {
          return false;
        }
      }

      if (typeof content === "string") {
        await writeFile(path, content, "utf8");
      } else {
        await writeFile(path, content);
      }

      return true;
    } catch {
      return false;
    }
  }

  writeU8(path: string, content: Uint8Array): Promise<boolean> {
    return this.write(path, content);
  }

  writeStr(path: string, content: string): Promise<boolean> {
    return this.write(path, content);
  }

  async remove(path: string, recursive = false): Promise<boolean> {
    try {
      await rm(path, { recursive, force: true });

      return true;
    } catch {
      return false;
    }
  }
}
