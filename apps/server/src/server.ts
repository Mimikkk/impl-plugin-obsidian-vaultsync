import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { sanitize } from "./path.ts";

const root = resolve(process.env.STORAGE_URL || "./data");
const port = +(process.env.SERVER_PORT || "8080");
const hostname = process.env.SERVER_HOST || "0.0.0.0";

const abs = (path: string) => resolve(root, path);

function filePath(c: Context) {
  return sanitize(c.req.query("path") ?? "");
}

async function hashFile(path: string) {
  const bytes = await Bun.file(path).arrayBuffer();
  return new Bun.CryptoHasher("sha256").update(bytes).digest("hex");
}

async function listFiles() {
  const files: { path: string; hash: string }[] = [];

  const walk = async (dir: string) => {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const next = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(next);
        continue;
      }
      if (!entry.isFile()) continue;
      files.push({
        path: relative(root, next).split(sep).join("/"),
        hash: await hashFile(next),
      });
    }
  };

  await mkdir(root, { recursive: true });
  await walk(root);
  return files;
}

export const app = new Hono();
app.use("*", cors());

app.get("/files", async (c) => c.json(await listFiles()));

app.get("/file", async (c) => {
  const path = filePath(c);
  if (!path) return c.json({ error: "invalid path" }, 400);

  const file = Bun.file(abs(path));
  if (!(await file.exists())) return c.json({ error: "missing" }, 404);

  return new Response(file.stream(), {
    headers: { "content-type": file.type || "application/octet-stream" },
  });
});

app.put("/file", async (c) => {
  const path = filePath(c);
  if (!path) return c.json({ error: "invalid path" }, 400);

  const bytes = new Uint8Array(await c.req.arrayBuffer());
  const target = abs(path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return c.json({ ok: true });
});

app.delete("/file", async (c) => {
  const path = filePath(c);
  if (!path) return c.json({ error: "invalid path" }, 400);

  try {
    await rm(abs(path), { force: true });
  } catch {
    return c.json({ error: "failed" }, 500);
  }
  return c.json({ ok: true });
});

if (import.meta.main) {
  const server = Bun.serve({ port, hostname, fetch: app.fetch });
  console.info(`listening on ${server.hostname}:${server.port} (storage ${root})`);
}
