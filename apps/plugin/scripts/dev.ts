import { watch } from "node:fs";
import { join, resolve } from "node:path";
import { colors } from "../../../scripts/ansi.ts";
import { copyTree, ensureDir, exists, removeDir } from "../../../scripts/fs.ts";
import "../../../scripts/read-env.ts";

interface FsEvent {
  paths: string[];
}

const nextlineRe = /\r?\n/;
const lines = (text: string) => text.trim().split(nextlineRe);

const rebuild = async () => {
  const process = Bun.spawn(["bun", "run", "build"], { stdout: "pipe", stderr: "pipe" });
  const [exitCode, stdout, stderr] = await Promise.all([
    process.exited,
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
  ]);

  const outputLines = lines(stdout);
  const errorLines = lines(stderr);

  console.info(`${colors.green("[Task]")} sync:`);
  console.info(errorLines.map((line) => `  - ${line}`).join("\n"));
  console.info(outputLines.map((line) => `  - ${line}`).join("\n"));

  if (exitCode !== 0) return "build-failed";
  return "build-success";
};

const createDebouncedEventHandler = (
  { onEvent, debounceMs = 200 }: { onEvent: (event: FsEvent) => Promise<void> | void; debounceMs?: number },
) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let lastEvent: FsEvent | undefined;
  const handle = async () => {
    if (lastEvent) {
      await onEvent(lastEvent);
      lastEvent = undefined;
    }

    timeout = undefined;
  };

  return (event: FsEvent) => {
    lastEvent = event;

    if (timeout !== undefined) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(handle, debounceMs);
  };
};

const watching = process.argv.includes("--watch");

const synchronize = async ({ localUrl, remoteUrl }: { localUrl: string; remoteUrl: string }) => {
  console.info(`${colors.blue("[event]")} Syncing plugin to vault...`);
  const result = await rebuild();
  if (result === "build-failed") {
    console.info(`${colors.red("[event]")} Build failed. Please check the error message.`);
    return;
  }

  await ensureDir(remoteUrl);
  await removeDir(remoteUrl);
  await ensureDir(remoteUrl);
  await copyTree(localUrl, remoteUrl);

  console.info(`${colors.blue("[event]")} Plugin synced to vault successfully!`);

  if (watching) {
    console.info(`${colors.gray("[info]")} Watching for changes...`);
  }
};

const vaultPath = process.env.VAULT_PATH;
const parseUrls = async (vaultUrl?: string) => {
  if (!vaultUrl) {
    return "vault-path-not-set";
  }
  if (!(await exists(vaultUrl))) {
    return "obsidian-location-does-not-exist";
  }

  const pluginLocalUrl = `dist`;
  const obsidianUrl = join(vaultUrl, ".obsidian");
  const pluginsUrl = join(obsidianUrl, "plugins");
  const pluginRemoteUrl = join(pluginsUrl, "vault-sync");

  return { localUrl: pluginLocalUrl, remoteUrl: pluginRemoteUrl };
};

const urls = await parseUrls(vaultPath);

if (urls === "vault-path-not-set") {
  console.error(`${colors.red("[error]")} VAULT_PATH is not set.`);
  console.error("- Please set the VAULT_PATH environment variable to the path of your Obsidian vault.");
  process.exit(1);
}

if (urls === "obsidian-location-does-not-exist") {
  console.error(`${colors.red("[error]")} Obsidian location does not exist.`);
  console.error("- Please check your vault path.");
  process.exit(1);
}

await synchronize(urls);
if (!watching) process.exit(0);

const paths = [resolve("."), resolve("../../libs/interaction"), resolve("../../libs/shared")];
const handleEvent = createDebouncedEventHandler({ onEvent: () => synchronize(urls), debounceMs: 500 });
for (const path of paths) {
  watch(path, { recursive: true }, (_event, filename) => {
    handleEvent({ paths: [filename ? join(path, filename) : path] });
  });
}
