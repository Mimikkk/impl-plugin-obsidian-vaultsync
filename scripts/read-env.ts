import { resolve } from "node:path";

async function load(file: string) {
  const path = resolve(file);
  const fileHandle = Bun.file(path);
  if (!(await fileHandle.exists())) return;

  const text = await fileHandle.text();
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq <= 0) continue;

    let key = line.slice(0, eq).trim();
    if (key.startsWith("export ")) key = key.slice(7).trim();

    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value === "") continue;
    process.env[key] = value;
  }
}

const dirs = [...new Set([resolve(import.meta.dir, ".."), process.cwd()])];
for (const dir of dirs) {
  await load(resolve(dir, ".env"));
  await load(resolve(dir, ".env.local"));
}
