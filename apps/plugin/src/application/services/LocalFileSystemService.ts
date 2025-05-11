import { ClientState } from "@plugin/application/state/ClientState.ts";
import { LocalFileSystemClient } from "@plugin/infrastructure/clients/LocalFileSystemClient.ts";

export namespace LocalFileSystemService {
  const client = LocalFileSystemClient;
  const state = ClientState;

  export const info = (path: string) => ({
    deleted: state.deleted.has(path),
    modified: state.deleted.get(path),
  });
  export const list = client.list;
  export const read = client.read;
  export const remove = client.remove;
  export const update = client.update;
}
