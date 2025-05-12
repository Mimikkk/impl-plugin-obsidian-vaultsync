import { LocalFileSystemClient } from "@plugin/infrastructure/clients/LocalFileSystemClient.ts";
import { ClientState } from "@plugin/presentation/state/ClientState.ts";

export namespace LocalFileSystemService {
  const client = LocalFileSystemClient;
  const state = ClientState;

  export const info = (path: string) => ({
    deleted: state.deleted.has(path),
    modified: state.deleted.get(path),
  });
  export const list = () => client.descriptors();
  export const read = (path: string) => client.read(path);
  export const remove = (path: string) => client.remove(path);
  export const update = (path: string, content: ArrayBuffer) => client.update(path, content);
}
