import { Modal } from "obsidian";
import { lineDiff } from "./diff.ts";

export type ConflictResult =
  | { action: "skip" }
  | { action: "remote" }
  | { action: "send"; bytes: ArrayBuffer };

const decoder = new TextDecoder();
const encoder = new TextEncoder();

function isMarkdown(path: string) {
  return path.toLowerCase().endsWith(".md");
}

export function resolveConflict(path: string, local: ArrayBuffer, remote: ArrayBuffer) {
  return new Promise<ConflictResult>((resolve) => {
    const modal = new ConflictModal(path, local, remote, resolve);
    modal.open();
  });
}

class ConflictModal extends Modal {
  private settled = false;
  private editor: HTMLTextAreaElement | undefined;

  constructor(
    private readonly file: string,
    private readonly local: ArrayBuffer,
    private readonly remote: ArrayBuffer,
    private readonly finish: (result: ConflictResult) => void,
  ) {
    super(globalThis.app);
  }

  override onOpen() {
    const localText = decoder.decode(this.local);
    const remoteText = decoder.decode(this.remote);
    const markdown = isMarkdown(this.file);

    this.titleEl.setText("Conflict");
    this.contentEl.createEl("p", { text: this.file, cls: "mod-muted" });

    if (markdown) {
      const pre = this.contentEl.createEl("pre", { cls: "vault-sync-diff" });
      for (const line of lineDiff(localText, remoteText)) {
        const row = pre.createDiv({ cls: `vault-sync-diff-${line.kind}` });
        row.setText(`${line.kind === "del" ? "-" : line.kind === "add" ? "+" : " "} ${line.text}`);
      }

      this.editor = this.contentEl.createEl("textarea", { cls: "vault-sync-editor" });
      this.editor.value = localText;
    } else {
      this.contentEl.createEl("p", { text: "Not markdown. Send local, take remote, or skip." });
    }

    const buttons = this.contentEl.createDiv({ cls: "modal-button-container" });
    buttons.createEl("button", { text: "Send", cls: "mod-cta" }).addEventListener("click", () => {
      if (!this.editor) {
        this.done({ action: "send", bytes: this.local });
        return;
      }
      const encoded = encoder.encode(this.editor.value);
      const bytes = encoded.buffer.slice(
        encoded.byteOffset,
        encoded.byteOffset + encoded.byteLength,
      );
      this.done({ action: "send", bytes });
    });
    buttons.createEl("button", { text: "Take remote" }).addEventListener("click", () => {
      this.done({ action: "remote" });
    });
    buttons.createEl("button", { text: "Skip" }).addEventListener("click", () => {
      this.done({ action: "skip" });
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
