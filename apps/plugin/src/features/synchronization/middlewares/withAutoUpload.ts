import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { applyingRemote } from "@plugin/features/synchronization/infrastructure/applyingRemote.ts";
import { FileChangeManager } from "@plugin/features/synchronization/application/managers/FileChangeManager.ts";
import { resolve } from "@nimir/framework";
import { TFile } from "obsidian";

export const withAutoUpload = createMiddleware((plugin) => {
  const changes = resolve(FileChangeManager);
  const pending = new Map<string, ReturnType<typeof setTimeout>>();

  const schedule = (path: string, action: () => Promise<void>) => {
    const previous = pending.get(path);
    if (previous) clearTimeout(previous);
    pending.set(
      path,
      setTimeout(() => {
        pending.delete(path);
        if (applyingRemote.quiet) return;
        action().catch((error) => console.error("auto-upload failed:", path, error));
      }, 750),
    );
  };

  plugin.registerEvent(
    plugin.app.vault.on("create", (file) => {
      if (!(file instanceof TFile) || applyingRemote.quiet) return;
      schedule(file.path, () => changes.updateRemote(file.path));
    }),
  );

  plugin.registerEvent(
    plugin.app.vault.on("modify", (file) => {
      if (!(file instanceof TFile) || applyingRemote.quiet) return;
      schedule(file.path, () => changes.updateRemote(file.path));
    }),
  );

  plugin.registerEvent(
    plugin.app.vault.on("delete", (file) => {
      if (!(file instanceof TFile) || applyingRemote.quiet) return;
      schedule(file.path, () => changes.removeRemote(file.path));
    }),
  );

  plugin.registerEvent(
    plugin.app.vault.on("rename", (file, previousPath) => {
      if (!(file instanceof TFile) || applyingRemote.quiet) return;
      schedule(previousPath, async () => {
        await changes.removeRemote(previousPath);
        await changes.updateRemote(file.path);
      });
    }),
  );
});
