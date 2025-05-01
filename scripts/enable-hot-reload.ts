import * as fs from "jsr:@std/fs";
import * as path from "jsr:@std/path";
import "./env.ts";

const command = async ({ args, cwd }: { args: string[]; cwd?: string }) => {
  const process = new Deno.Command("git", { args, cwd });
  const output = await process.output();

  if (!output.success) {
    return "command-failure";
  }

  return new TextDecoder().decode(output.stdout).trim();
};

async function getRemoteHash(remoteUrl: string): Promise<string | null> {
  const result = await command({ args: ["ls-remote", remoteUrl, "HEAD"] });
  return result === "command-failure" ? result : result.split(/\s+/)[0];
}

async function getLocalHash(localUrl: string): Promise<string | null> {
  return await command({ args: ["rev-parse", "HEAD"], cwd: localUrl });
}

const isSameHash = async (
  remoteUrl: string,
  localUrl: string,
): Promise<boolean | "invalid-remote-hash" | "invalid-local-hash"> => {
  const localHash = await getLocalHash(localUrl);
  if (localHash === "command-failure") {
    return "invalid-local-hash";
  }
  const remoteHash = await getRemoteHash(remoteUrl);
  if (remoteHash === "command-failure") {
    return "invalid-remote-hash";
  }

  return remoteHash === localHash;
};

interface HotReloadRepoUrls {
  remoteUrl: string;
  localUrl: string;
}

export async function enableHotReload({ remoteUrl, localUrl }: HotReloadRepoUrls) {
  let tempUrl: string | undefined = undefined;
  try {
    tempUrl = await Deno.makeTempDir();
    const isAlreadyInstalled = await fs.exists(localUrl);

    if (isAlreadyInstalled) {
      const result = await isSameHash(remoteUrl, localUrl);

      if (result === true) {
        return "already-up-to-date";
      } else if (result !== false) {
        return result;
      }
    }

    console.log(`[info] Downloading hot-reload plugin from: ${remoteUrl}`);
    if (isAlreadyInstalled) {
      console.log("[info] Removing outdated plugin directory.");
      await Deno.remove(localUrl, { recursive: true });
      await fs.ensureDir(localUrl);
    }

    const cloneResult = await command({ args: ["clone", remoteUrl, tempUrl] });

    if (cloneResult === "command-failure") {
      return "clone-failure";
    }

    for await (const entry of fs.walk(tempUrl, { includeDirs: false })) {
      if (entry.isFile) {
        const relativePath = path.relative(tempUrl, entry.path);
        const targetPath = path.join(localUrl, relativePath);

        await fs.ensureDir(path.dirname(targetPath));
        await fs.copy(entry.path, targetPath, { overwrite: true });
      }
    }

    console.log("[info] Hot-reload plugin installed successfully to", localUrl);
  } catch {
    return "install-failure";
  } finally {
    if (tempUrl !== undefined) {
      await Deno.remove(tempUrl, { recursive: true });
    }
  }
}

const parseRepoUrls = async (vaultUrl?: string) => {
  if (!vaultUrl) {
    return "env-not-set";
  }
  if (!(await fs.exists(vaultUrl))) {
    return "obsidian-location-does-not-exist";
  }

  const remoteUrl = "https://github.com/pjeby/hot-reload.git";
  const obsidianUrl = path.join(vaultUrl, ".obsidian");
  const pluginsUrl = path.join(obsidianUrl, "plugins");
  const pluginUrl = path.join(pluginsUrl, "hot-reload");

  await fs.ensureDir(pluginUrl);

  return { remoteUrl, localUrl: pluginUrl };
};

const urlsResult = await parseRepoUrls(Deno.env.get("VAULT_PATH"));
if (urlsResult === "env-not-set") {
  console.error("[error] VAULT_PATH is not set.");
  console.error("- Please set the VAULT_PATH environment variable to the path of your Obsidian vault.");
  Deno.exit(1);
}

if (urlsResult === "obsidian-location-does-not-exist") {
  console.error("[error] Obsidian location does not exist.");
  console.error("- Please check your vault path.");
  Deno.exit(1);
}

const result = await enableHotReload(urlsResult);

if (result === "already-up-to-date") {
  console.log("[info] Hot-reload plugin is already up to date.");
  Deno.exit(0);
}

if (result === "invalid-local-hash") {
  console.error("[error] Invalid local hash. Please check your vault path.");
  console.error("- Verify your vault path is correct.");
  Deno.exit(1);
}

if (result === "invalid-remote-hash") {
  console.error("[error] Invalid remote hash. Please check your internet connection.");
  console.error("- Please check your internet connection.");
  console.error("- Please check the remote URL.");
  Deno.exit(1);
}

if (result === "clone-failure") {
  console.error("[error] Failed to clone repository.");
  console.error("- Please check your internet connection.");
  console.error("- Please check the remote URL.");
  Deno.exit(1);
}
