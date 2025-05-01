import { colors } from "@cliffy/ansi/colors";
import * as fs from "@std/fs";
import * as path from "@std/path";
import "./read-env.ts";

const nextlineRe = /\r?\n/;
const lines = (text: Uint8Array) => new TextDecoder().decode(text).trim().split(nextlineRe);

const rebuild = async () => {
  const { stderr, stdout, success } = await new Deno.Command("deno", {
    args: ["task", "-f", "plugin", "build"],
    stdout: "piped",
    stderr: "piped",
  }).output();

  const outputLines = lines(stdout);
  const errorLines = lines(stderr);

  console.info(`${colors.green("[Task]")} sync:`);
  console.info(errorLines.map((line) => `  - ${line}`).join("\n"));
  console.info(outputLines.map((line) => `  - ${line}`).join("\n"));

  if (!success) return "build-failed";
  return "build-success";
};

const createDebouncedEventHandler = (
  { onEvent, debounceMs = 200 }: { onEvent: (event: Deno.FsEvent) => Promise<void> | void; debounceMs?: number },
) => {
  let timeout: number | undefined;
  let lastEvent: Deno.FsEvent | undefined;
  const handle = async () => {
    if (lastEvent) {
      await onEvent(lastEvent);
      lastEvent = undefined;
    }

    timeout = undefined;
  };

  return (event: Deno.FsEvent) => {
    lastEvent = event;

    if (timeout !== undefined) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(handle, debounceMs);
  };
};

const synchronize = async ({ localUrl, remoteUrl }: { localUrl: string; remoteUrl: string }) => {
  console.clear();
  console.info(`${colors.blue("[event]")} Syncing plugin to vault...`);
  const result = await rebuild();
  if (result === "build-failed") {
    console.info(`${colors.red("[event]")} Build failed. Please check the error message.`);
    return;
  }

  await fs.ensureDir(remoteUrl);
  await Deno.remove(remoteUrl, { recursive: true });
  await fs.ensureDir(remoteUrl);

  for await (const entry of fs.walk(localUrl, { includeDirs: false })) {
    if (entry.isFile) {
      const relativePath = path.relative(localUrl, entry.path);
      const targetPath = path.join(remoteUrl, relativePath);

      await fs.ensureDir(path.dirname(targetPath));
      await fs.copy(entry.path, targetPath, { overwrite: true });
    }
  }

  console.info(`${colors.blue("[event]")} Plugin synced to vault successfully!`);
  console.info(`${colors.gray("[info]")} Watching for changes...`);
};

const vaultPath = Deno.env.get("VAULT_PATH");
const parseUrls = async (vaultUrl?: string) => {
  if (vaultUrl === undefined) {
    return "vault-path-not-set";
  }
  if (!(await fs.exists(vaultUrl))) {
    return "obsidian-location-does-not-exist";
  }

  const pluginLocalUrl = `apps/plugin/dist`;
  const obsidianUrl = path.join(vaultUrl, ".obsidian");
  const pluginsUrl = path.join(obsidianUrl, "plugins");
  const pluginRemoteUrl = path.join(pluginsUrl, "vault-sync");

  return { localUrl: pluginLocalUrl, remoteUrl: pluginRemoteUrl };
};

const urls = await parseUrls(vaultPath);

if (urls === "vault-path-not-set") {
  console.error(`${colors.red("[error]")} VAULT_PATH is not set.`);
  console.error("- Please set the VAULT_PATH environment variable to the path of your Obsidian vault.");
  Deno.exit(1);
}

if (urls === "obsidian-location-does-not-exist") {
  console.error(`${colors.red("[error]")} Obsidian location does not exist.`);
  console.error("- Please check your vault path.");
  Deno.exit(1);
}

await synchronize(urls);
if (!Deno.args.includes("--watch")) Deno.exit(0);

const watcher = Deno.watchFs("apps/plugin/src");
const handleEvent = createDebouncedEventHandler({ onEvent: () => synchronize(urls), debounceMs: 500 });
for await (const event of watcher) {
  handleEvent(event);
}
