import { colors } from "@cliffy/ansi/colors";
import * as fs from "@std/fs";
import * as path from "@std/path";
import "./read-env.ts";

const command = async ({ args, cwd }: { args: string[]; cwd?: string }) => {
  const process = new Deno.Command("git", { args, cwd });
  const output = await process.output();

  if (!output.success) {
    return "command-failure";
  }

  return new TextDecoder().decode(output.stdout).trim();
};

async function getRemoteHash(remoteUrl: string) {
  const result = await command({ args: ["ls-remote", remoteUrl, "HEAD"] });

  return result === "command-failure" ? result : result.split(/\s+/)[0];
}

async function getLocalHash(localUrl: string) {
  if (!(await fs.exists(path.join(localUrl, ".git")))) {
    return "no-git-hash";
  }

  const result = await command({ args: ["rev-parse", "HEAD"], cwd: localUrl });

  return result === "command-failure" ? result : result.split(/\s+/)[0];
}

const isSameHash = async ({ remoteUrl, localUrl }: { remoteUrl: string; localUrl: string }) => {
  const localHash = await getLocalHash(localUrl);
  if (localHash === "command-failure") {
    return "invalid-local-hash";
  }

  if (localHash === "no-git-hash") {
    return false;
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

export async function main({ remoteUrl, localUrl }: HotReloadRepoUrls) {
  let tempUrl: string | undefined = undefined;
  try {
    tempUrl = await Deno.makeTempDir();
    const isAlreadyInstalled = await fs.exists(localUrl);

    if (isAlreadyInstalled) {
      const result = await isSameHash({ remoteUrl, localUrl });

      if (result === true) {
        return "already-up-to-date";
      } else if (result !== false) {
        return result;
      }
    }

    console.info(`${colors.gray("[info]")} Downloading hot-reload plugin from: ${remoteUrl}`);
    if (isAlreadyInstalled) {
      console.info(`${colors.gray("[info]")} Removing outdated plugin directory.`);
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

    console.info(`${colors.gray("[info]")} Hot-reload plugin installed successfully to ${localUrl}`);
  } catch {
    return "install-failure";
  } finally {
    if (tempUrl !== undefined) {
      await Deno.remove(tempUrl, { recursive: true });
    }
  }

  return "success";
}

const parseRepoUrls = async (vaultUrl?: string) => {
  if (!vaultUrl) {
    return "vault-env-not-set";
  }
  if (!(await fs.exists(vaultUrl))) {
    return "obsidian-location-does-not-exist";
  }

  const remoteUrl = "https://github.com/pjeby/hot-reload.git";
  const obsidianUrl = path.join(vaultUrl, ".obsidian");
  const pluginsUrl = path.join(obsidianUrl, "plugins");
  const localUrl = path.join(pluginsUrl, "hot-reload");

  await fs.ensureDir(localUrl);

  return { remoteUrl, localUrl };
};

const urls = await parseRepoUrls(Deno.env.get("VAULT_PATH"));
if (urls === "vault-env-not-set") {
  console.error(`${colors.red("[error]")} VAULT_PATH is not set.`);
  console.error("- Please set the VAULT_PATH environment variable to the path of your Obsidian vault.");
  Deno.exit(1);
}

if (urls === "obsidian-location-does-not-exist") {
  console.error(`${colors.red("[error]")} Obsidian location does not exist.`);
  console.error("- Please check your vault path.");
  Deno.exit(1);
}
const result = await main(urls);

if (result === "already-up-to-date") {
  console.info(`${colors.yellow("[skip]")} Hot-reload plugin is already up to date.`);
  Deno.exit(0);
}

if (result === "invalid-local-hash") {
  console.error(`${colors.red("[error]")} Invalid local hash. Please check your vault path.`);
  console.error("- Verify your vault path is correct.");
  Deno.exit(1);
}

if (result === "invalid-remote-hash") {
  console.error(`${colors.red("[error]")} Invalid remote hash. Please check your internet connection.`);
  console.error("- Please check your internet connection.");
  console.error("- Please check the remote URL.");
  Deno.exit(1);
}

if (result === "clone-failure") {
  console.error(`${colors.red("[error]")} Failed to clone repository.`);
  console.error("- Please check your internet connection.");
  console.error("- Please check the remote URL.");
  Deno.exit(1);
}

if (result === "success") {
  console.info(`${colors.green("[success]")} Hot-reload plugin enabled successfully.`);
  Deno.exit(0);
}
