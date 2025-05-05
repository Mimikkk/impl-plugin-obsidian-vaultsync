import { FileReader } from "@server/infrastructure/files/readers/FileReader.ts";
import { StaticFileNs } from "@server/modules/static/domain/StaticFile.ts";
import { extname, resolve } from "@std/path";

export class FileSystemReader {
  static create(path: string = "."): FileSystemReader {
    return new FileSystemReader(path);
  }

  private constructor(
    private readonly location: string,
    private readonly reader = FileReader.create(),
  ) {}

  path(path: string): string {
    return resolve(this.location, path);
  }

  async read<P extends StaticFileNs.Path>(path: P): Promise<StaticFileNs.FromPath<P> | undefined> {
    path = this.path(path) as P;

    const extension = extname(path).slice(1) as StaticFileNs.Extension;
    if (!extension) return undefined;

    const type = StaticFileNs.TypeMap[extension] ?? StaticFileNs.typeFallback;
    const content = await this.reader.read(path, type);
    if (content === undefined) return undefined;

    const mime = StaticFileNs.MimeMap[extension] ?? StaticFileNs.mimeFallback;
    return { content, mime } as StaticFileNs.FromPath<P>;
  }

  async readStr(path: string): Promise<string | undefined> {
    return await this.reader.readStr(this.path(path));
  }

  async readU8(path: string): Promise<Uint8Array | undefined> {
    return await this.reader.readU8(this.path(path));
  }

  async list(options: { path?: string; recursive?: boolean }): Promise<string[]> {
    async function traverse(paths: string[], path: string, recursive: boolean): Promise<string[]> {
      for await (const entry of Deno.readDir(path)) {
        const next = resolve(path, entry.name);
        paths.push(next);

        if (recursive && entry.isDirectory) {
          const subPaths = await traverse(paths, next, recursive);

          paths.push(...subPaths);
        }
      }

      return paths;
    }
    const start = this.path(options.path ?? ".");
    const paths = await traverse([], start, options.recursive ?? false);

    return paths.map((path) => path.replace(start + "\\", ""));
  }
}
