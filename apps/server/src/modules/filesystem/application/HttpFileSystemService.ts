import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import { FileSystemManager } from "@server/infrastructure/files/managers/FileSystemManager.ts";
import { PathSanitizer } from "@server/modules/filesystem/infrastructure/files/PathSanitizer.ts";

export class HttpFileSystemService {
  static create() {
    return new HttpFileSystemService();
  }

  private constructor(
    private readonly manager = FileSystemManager.create(EnvironmentConfiguration.storageUrl),
    private readonly sanitizer = PathSanitizer.create(),
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

  async write(path: string, content: Uint8Array) {
    const result = this.sanitizer.sanitize(path);

    if ("error" in result) {
      return result.error;
    }

    const success = await this.manager.writeU8(result.value, content);

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
}
