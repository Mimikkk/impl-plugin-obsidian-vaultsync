import { SyncService } from "@plugin/application/services/SyncService.ts";
import { Memory } from "@plugin/domain/storage/Memory.ts";
import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";
import { Status } from "../../shared/types/Status.ts";

export enum EntryType {
  File = "FILE_INFO_TYPE_FILE",
  Directory = "FILE_INFO_TYPE_DIRECTORY",
  Symlink = "FILE_INFO_TYPE_SYMLINK",
  SymlinkFile = "FILE_INFO_TYPE_SYMLINK_FILE",
  SymlinkDirectory = "FILE_INFO_TYPE_SYMLINK_DIRECTORY",
}

export namespace EntryTypeNs {
  const { File, Directory, Symlink, SymlinkFile, SymlinkDirectory } = EntryType;

  export const isFile = (entry: any) => entry.type === File || isSymlink(entry);
  export const isDirectory = ({ type }: any) => type === Directory || type === SymlinkDirectory;
  export const isSymlink = ({ type }: any) => type === Symlink || type === SymlinkFile || type === SymlinkDirectory;
}

// "modTime" : "2020-10-02T23:48:52.076996974+02:00",
// "name" : "100ANDRO",
// "size" : 128,
// "type" : "FILE_INFO_TYPE_DIRECTORY"
export type DateTimeStr = string;
export namespace DateTimeStrs {
  export const asDate = (date: DateTimeStr) => new Date(date);
  export const asTimestamp = (date: DateTimeStr) => asDate(date).getTime();
}

export interface FileDescriptor {
  modTime: DateTimeStr;
  name: string;
  size: number;
  type: string;
}

export const useSyncEvents = (options?: { enabled?: Accessor<boolean> }) =>
  Status.accessQuery(useQuery(() => ({
    queryKey: ["sync-events"],
    queryFn: async () => {
      await SyncService.scan();

      const id = Memory.lastSeenEventId.get();
      // const events = await SyncService.events({ events: ["LocalIndexUpdated"], since: id });

      const traverse = async (descriptors: any[] = [], folder: string = "default", root: string = "") => {
        const files = await SyncService.get<FileDescriptor[]>("db/browse", undefined, {
          folder,
          prefix: root,
          levels: 0,
        });

        for (const file of files) {
          const path = root ? `${root}/${file.name}` : file.name;

          if (EntryTypeNs.isFile(file)) {
            descriptors.push({ path, timestamp: DateTimeStrs.asTimestamp(file.modTime) });
            continue;
          }

          await traverse(descriptors, folder, path);
        }

        return descriptors;
      };

      const descriptors = await traverse();

      for (const descriptor of descriptors) {
        const needsUpdate = true;
        if (!needsUpdate) continue;

        await SyncService.download(descriptor.path);
      }

      console.log({ descriptors });

      // const last = events[events.length - 1];
      // if (last) {
      //   Memory.lastSeenEventId.set(last.id);
      // }

      // return events;
      return "OK";
    },
    // refetchInterval: TimeMs.seconds(5),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    gcTime: 0,
    staleTime: 0,
    retry: 0,
  })));
