import { singleton } from "@nimir/framework";
import { type FileInfo, FileType } from "../../../../core/domain/types/FileTypes.ts";

@singleton
export class FileGrouper {
  static create() {
    return new FileGrouper();
  }

  private constructor() {}

  byLocation(files: FileInfo[]): FileGrouperNs.LocationGroups {
    const locals = files.filter((f) => f.type === FileType.Local);
    const remotes = files.filter((f) => f.type === FileType.Remote);

    const both = [];
    const localOnly = [];
    const remoteOnly = [];

    for (const local of locals) {
      const remote = remotes.find((r) => r.path === local.path);

      if (remote) {
        both.push({ local, remote });
      } else {
        localOnly.push(local);
      }
    }

    for (const remote of remotes) {
      if (locals.some((l) => l.path === remote.path)) continue;
      remoteOnly.push(remote);
    }

    return { both, localOnly, remoteOnly };
  }
}

export namespace FileGrouperNs {
  export interface LocationGroups {
    both: { local: FileInfo; remote: FileInfo }[];
    localOnly: FileInfo[];
    remoteOnly: FileInfo[];
  }
}
