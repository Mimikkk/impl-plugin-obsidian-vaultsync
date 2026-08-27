import { Modal } from "obsidian";
import { lineDiff } from "./diff.ts";

export type ConflictResult =
  | { action: "skip" }
  | { action: "local" }
  | { action: "remote" }
  | { action: "apply"; bytes: ArrayBuffer };

const decoder = new TextDecoder();
const encoder = new TextEncoder();

function isMarkdown(path: string) {
  return path.toLowerCase().endsWith(".md");
}

export function resolveConflict(
  localPath: string,
  remotePath: string,
  local: ArrayBuffer,
  remote: ArrayBuffer,
) {
  return new Promise<ConflictResult>((resolve) => {
    const modal = new ConflictModal(localPath, remotePath, local, remote, resolve);
    modal.open();
  });
}

class ConflictModal extends Modal {
  private settled = false;
  private editor: HTMLTextAreaElement | undefined;

  constructor(
    private readonly localPath: string,
    private readonly remotePath: string,
    private readonly local: ArrayBuffer,
    private readonly remote: ArrayBuffer,
    private readonly finish: (result: ConflictResult) => void,
  ) {
    super(globalThis.app);
  }

  override onOpen() {
    const localText = decoder.decode(this.local);
    const remoteText = decoder.decode(this.remote);
    const markdown = isMarkdown(this.localPath) || isMarkdown(this.remotePath);

    this.titleEl.setText("Conflict");
    if (this.localPath === this.remotePath) {
      this.contentEl.createEl("p", { text: this.localPath, cls: "mod-muted" });
    } else {
      this.contentEl.createEl("p", { text: `Local: ${this.localPath}`, cls: "mod-muted" });
      this.contentEl.createEl("p", { text: `Remote: ${this.remotePath}`, cls: "mod-muted" });
    }

    if (markdown) {
      const pre = this.contentEl.createEl("pre", { cls: "vault-sync-diff" });
      for (const line of lineDiff(localText, remoteText)) {
        const row = pre.createDiv({ cls: `vault-sync-diff-${line.kind}` });
        row.setText(`${line.kind === "del" ? "-" : line.kind === "add" ? "+" : " "} ${line.text}`);
      }

      this.editor = this.contentEl.createEl("textarea", { cls: "vault-sync-editor" });
      this.editor.value = localText;
    } else {
      this.contentEl.createEl("p", { text: "Not markdown. Accept a side or apply local bytes." });
    }

    const buttons = this.contentEl.createDiv({ cls: "modal-button-container" });
    buttons.createEl("button", { text: "Accept local" }).addEventListener("click", () => {
      this.done({ action: "local" });
    });
    buttons.createEl("button", { text: "Accept remote" }).addEventListener("click", () => {
      this.done({ action: "remote" });
    });
    buttons.createEl("button", { text: "Apply", cls: "mod-cta" }).addEventListener("click", () => {
      if (!this.editor) {
        this.done({ action: "apply", bytes: this.local });
        return;
      }
      const encoded = encoder.encode(this.editor.value);
      const bytes = encoded.buffer.slice(
        encoded.byteOffset,
        encoded.byteOffset + encoded.byteLength,
      ) as ArrayBuffer;
      this.done({ action: "apply", bytes });
    });
  }

  override onClose() {
    if (!this.settled) this.finish({ action: "skip" });
  }

  private done(result: ConflictResult) {
    this.settled = true;
    this.close();
    this.finish(result);
  }
}
