export enum ChangeType {
  UpdateLocal = "update-local",
  UpdateRemote = "update-remote",
  RemoveLocal = "remove-local",
  RemoveRemote = "remove-remote",
}

export interface ChangeCommand {
  type: ChangeType;
  path: string;
}

export namespace ChangeCommands {
  export const updateLocal = (path: string): ChangeCommand => ({ type: ChangeType.UpdateLocal, path });
  export const updateRemote = (path: string): ChangeCommand => ({ type: ChangeType.UpdateRemote, path });
  export const removeLocal = (path: string): ChangeCommand => ({ type: ChangeType.RemoveLocal, path });
  export const removeRemote = (path: string): ChangeCommand => ({ type: ChangeType.RemoveRemote, path });
}
