import { resolve, singleton } from "@nimir/framework";
import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import { FileSystemManager } from "@server/core/infrastructure/files/managers/FileSystemManager.ts";
import { PathSanitizer } from "@server/features/filesystem/infrastructure/files/PathSanitizer.ts";

@singleton
export class HttpFileSystemService {
  static create(
    manager = FileSystemManager.create(EnvironmentConfiguration.storageUrl),
    sanitizer = resolve(PathSanitizer),
  ) {
    return new HttpFileSystemService(manager, sanitizer);
  }

  private constructor(
    private readonly manager: FileSystemManager,
    private readonly sanitizer: PathSanitizer,
  ) {}

  async read(path: string) {
    const result = this.sanitizer.sanitize(path);

    if ("error" in result) {
      return result.error;
    }

    const file = await this.manager.readU8(result.value);

    if (file === undefined) {
      return "missing";
    }

    return { content: file, mime: this.mime(path), path: result.value };
  }

  async write(path: string, file: File) {
    const result = this.sanitizer.sanitize(path);

    if ("error" in result) {
      return result.error;
    }

    const array = new Uint8Array(await file.arrayBuffer());

    const success = await this.manager.writeU8(result.value, array);

    if (!success) {
      return "failure";
    }

    return "success";
  }

  async remove(path: string, recursive = false) {
    const result = this.sanitizer.sanitize(path);

    if ("error" in result) {
      return result.error;
    }

    const success = await this.manager.remove(result.value, recursive);

    if (!success) {
      return "failure";
    }

    return "success";
  }

  mime(path: string) {
    const result = this.sanitizer.sanitize(path);

    if ("error" in result) {
      return result.error;
    }

    return this.manager.mime(result.value);
  }

  async exists(path: string) {
    const result = this.sanitizer.sanitize(path);

    if ("error" in result) {
      return result.error;
    }

    return await this.manager.exists(result.value);
  }

  async list(path: string) {
    const result = this.sanitizer.sanitize(path);

    if ("error" in result) {
      return result.error;
    }

    return await this.manager.list({ path: result.value });
  }

  async stats(path: string) {
    const result = this.sanitizer.sanitize(path);

    if ("error" in result) {
      return result.error;
    }

    const stats = await this.manager.stats(result.value);

    if (stats === null) {
      return "missing";
    }

    return stats;
  }
}
