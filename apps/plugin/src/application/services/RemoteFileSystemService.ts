import { RemoteFileSystemClient } from "@plugin/infrastructure/clients/RemoteFileSystemClient.ts";

export namespace RemoteFileSystemService {
  const client = RemoteFileSystemClient;

  export const info = async (path: string) => {
    const info = await client.info(path);
    return info;
  };
  export const list = () => client.descriptors();
  export const read = (path: string) => client.read(path);
  export const remove = (path: string) => client.remove(path);
  export const update = (path: string, content: ArrayBuffer) => client.update(path, content);
}
