import { Modal } from "obsidian";
import { resolve } from "@nimir/framework";
import type { FileChange } from "@plugin/features/synchronization/domain/FileChange.ts";
import { FileChangeManager } from "@plugin/features/synchronization/application/managers/FileChangeManager.ts";
import { lineDiff } from "@plugin/features/synchronization/infrastructure/diffs/lineDiff.ts";
import { LocalFileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/LocalFileOperations.ts";
import { RemoteFileOperations } from "@plugin/features/synchronization/infrastructure/filesystems/RemoteFileOperations.ts";

function isMarkdown(path: string) {
  return path.toLowerCase().endsWith(".md");
}

function decode(buffer: ArrayBuffer | undefined) {
  if (!buffer) return "";
  return new TextDecoder().decode(buffer);
}

export function resolveConflicts(conflicts: FileChange[]) {
  if (conflicts.length === 0) return Promise.resolve();
  return new Promise<void>((resolvePromise) => {
    const modal = new ConflictModal(conflicts, resolvePromise);
    modal.open();
  });
}

class ConflictModal extends Modal {
  private index = 0;
  private finished = false;

  constructor(
    private readonly conflicts: FileChange[],
    private readonly onDone: () => void,
    private readonly locals = resolve(LocalFileOperations),
    private readonly remotes = resolve(RemoteFileOperations),
    private readonly changes = resolve(FileChangeManager),
  ) {
    super(globalThis.app);
  }

  override onOpen() {
    this.render();
  }

  override onClose() {
    if (this.finished) return;
    this.finished = true;
    this.onDone();
  }

  private async render() {
    const conflict = this.conflicts[this.index];
    this.contentEl.empty();
    this.titleEl.setText(`Conflict ${this.index + 1} of ${this.conflicts.length}`);

    if (!conflict) {
      this.close();
      return;
    }

    const [local, remote] = await Promise.all([
      this.locals.download(conflict.path),
      this.remotes.download(conflict.path),
    ]);

    this.contentEl.createEl("p", { text: conflict.path, cls: "mod-muted" });

    if (isMarkdown(conflict.path)) {
      const pre = this.contentEl.createEl("pre", { cls: "vault-sync-diff" });
      for (const line of lineDiff(decode(local), decode(remote))) {
        const row = pre.createDiv({ cls: `vault-sync-diff-${line.kind}` });
        row.setText(`${line.kind === "del" ? "-" : line.kind === "add" ? "+" : " "} ${line.text}`);
      }
    } else {
      this.contentEl.createEl("p", { text: "Binary or non-markdown file. Choose a side." });
    }

    const buttons = this.contentEl.createDiv({ cls: "modal-button-container" });
    buttons.createEl("button", { text: "Keep local" }).addEventListener("click", async () => {
      await this.changes.updateRemote(conflict.path);
      await this.next();
    });
    buttons
      .createEl("button", { text: "Keep remote", cls: "mod-cta" })
      .addEventListener("click", async () => {
        await this.changes.updateLocal(conflict.path);
        await this.next();
      });
    buttons.createEl("button", { text: "Skip" }).addEventListener("click", () => this.next());
  }

  private async next() {
    this.index += 1;
    if (this.index >= this.conflicts.length) {
      this.close();
      return;
    }
    await this.render();
  }
}
