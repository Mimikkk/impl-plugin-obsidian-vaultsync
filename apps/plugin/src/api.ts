import env from "@env";

const base = env.VAULT_SYNC_CLIENT_URL.replace(/\/+$/, "");

function url(path: string, file?: string) {
  const target = new URL(path, `${base}/`);
  if (file) target.searchParams.set("path", file);
  return target;
}

export const api = {
  async list(): Promise<{ path: string; hash: string }[]> {
    const response = await fetch(url("/files"));
    if (!response.ok) throw new Error(`list failed (${response.status})`);
    return response.json();
  },

  async get(path: string): Promise<ArrayBuffer | undefined> {
    const response = await fetch(url("/file", path));
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`download failed (${response.status})`);
    return response.arrayBuffer();
  },

  async put(path: string, body: ArrayBuffer) {
    const response = await fetch(url("/file", path), { method: "PUT", body });
    if (!response.ok) throw new Error(`upload failed (${response.status})`);
  },

  async delete(path: string) {
    const response = await fetch(url("/file", path), { method: "DELETE" });
    if (!response.ok && response.status !== 404)
      throw new Error(`delete failed (${response.status})`);
  },
};
