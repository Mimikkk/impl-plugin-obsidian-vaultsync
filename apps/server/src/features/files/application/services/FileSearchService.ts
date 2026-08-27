import { resolve, singleton } from "@nimir/framework";
import { FileType } from "@nimir/shared";
import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";
import { FileSystemManager } from "@server/core/infrastructure/files/managers/FileSystemManager.ts";
import { PathSanitizer } from "@server/features/files/infrastructure/files/PathSanitizer.ts";

@singleton
export class FileSearchService {
  static create(
    manager = FileSystemManager.create(EnvironmentConfiguration.storageUrl),
    sanitizer = resolve(PathSanitizer),
  ) {
    return new FileSearchService(manager, sanitizer);
  }

  private constructor(
    private readonly manager: FileSystemManager,
    private readonly sanitizer: PathSanitizer,
  ) {}

  async info(params: FileServiceNs.InfoParams) {
    const result = this.sanitizer.sanitize(params.file);
    if ("error" in result) return undefined;

    const stats = await this.manager.stats(result.value);
    if (!stats?.isFile) return undefined;

    return { deleted: false, modified: stats.mtime ?? new Date(0) };
  }

  async list(_params: FileServiceNs.ListParams) {
    const files = await this.manager.listFiles({ recursive: true });
    return files.map((file) => ({
      path: file.path,
      updatedAt: file.updatedAt,
      type: FileType.Remote,
    }));
  }
}

export namespace FileServiceNs {
  export interface ListParams {
    folder: string;
    prefix?: string;
  }

  export interface InfoParams {
    folder: string;
    file: string;
  }
}
