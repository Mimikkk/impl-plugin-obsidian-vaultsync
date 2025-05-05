import ky from "ky";
import { ServiceUrl } from "./ServiceUrl.ts";

export namespace FileSystemService {
  const url = ServiceUrl.sync + "/filesystem";

  export const read = async (path: string): Promise<File> => {
    const response = await ky.get(url, { searchParams: { path } });
    const buffer = await response.arrayBuffer();
    const name = response.headers.get("content-disposition")?.split("filename=")[1] || path.split("/").pop() || "file";
    const type = response.headers.get("content-type") || "application/octet-stream";

    return new File([buffer], name, { type });
  };
  export const write = (path: string, content: Uint8Array) => ky.post(url, { json: { path, content } });
  export const remove = (path: string, recursive = false) => ky.post(url, { json: { path, recursive } });
}
