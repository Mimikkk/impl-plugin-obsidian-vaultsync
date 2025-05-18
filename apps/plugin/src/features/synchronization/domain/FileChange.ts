export enum ChangeType {
  UpdateLocal = "update-local",
  UpdateRemote = "update-remote",
  RemoveLocal = "remove-local",
  RemoveRemote = "remove-remote",
}

export interface FileChange {
  type: ChangeType;
  path: string;
}

export namespace FileChanges {
  export const updateLocal = (path: string): FileChange => ({ type: ChangeType.UpdateLocal, path });
  export const updateRemote = (path: string): FileChange => ({ type: ChangeType.UpdateRemote, path });
  export const removeLocal = (path: string): FileChange => ({ type: ChangeType.RemoveLocal, path });
  export const removeRemote = (path: string): FileChange => ({ type: ChangeType.RemoveRemote, path });
}
