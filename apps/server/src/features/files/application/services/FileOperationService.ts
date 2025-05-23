import { resolve, singleton } from "@nimir/framework";
import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import { FileSystemManager } from "@server/core/infrastructure/files/managers/FileSystemManager.ts";
import { PathSanitizer } from "@server/features/files/infrastructure/files/PathSanitizer.ts";

@singleton
export class FileOperationService {
  static create(
    manager = FileSystemManager.create(EnvironmentConfiguration.storageUrl),
    sanitizer = resolve(PathSanitizer),
  ) {
    return new FileOperationService(manager, sanitizer);
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

  private mime(path: string) {
    const result = this.sanitizer.sanitize(path);

    if ("error" in result) {
      return result.error;
    }

    return this.manager.mime(result.value);
  }
}
