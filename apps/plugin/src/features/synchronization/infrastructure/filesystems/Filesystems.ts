import { resolve, singleton } from "@nimir/framework";
import { Filesystem } from "@plugin/features/synchronization/infrastructure/filesystems/Filesystem.ts";
import { LocalFileSearch } from "@plugin/features/synchronization/infrastructure/filesystems/LocalFileSearch.ts";
import { RemoteFileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/RemoteFileOperations.ts";
import { RemoteFileSearch } from "@plugin/features/synchronization/infrastructure/filesystems/RemoteFileSearch.ts";
import { LocalFileOperations } from "@plugin/features/synchronization/infrastructure/LocalFileOperations.ts";

export const RemoteFilesystem = singleton({
  create: () => Filesystem.create(resolve(RemoteFileSearch), resolve(RemoteFileOperations)),
  name: "RemoteFilesystem",
});

export const LocalFilesystem = singleton({
  create: () => Filesystem.create(resolve(LocalFileSearch), resolve(LocalFileOperations)),
  name: "LocalFilesystem",
});
