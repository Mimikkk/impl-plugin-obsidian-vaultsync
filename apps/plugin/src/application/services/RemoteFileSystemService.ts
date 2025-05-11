import { RemoteFileSystemClient } from "@plugin/infrastructure/clients/RemoteFileSystemClient.ts";

export namespace RemoteFileSystemService {
  const client = RemoteFileSystemClient;

  export const info = client.info;
  export const list = client.list;
  export const read = client.read;
  export const remove = client.remove;
  export const update = client.update;
}
