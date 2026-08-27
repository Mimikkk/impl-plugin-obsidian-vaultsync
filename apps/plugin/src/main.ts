import { Notice, Plugin } from "obsidian";
import { synchronize } from "./sync.ts";
import "./styles.css";

export default class VaultSyncPlugin extends Plugin {
  private bases: Record<string, string> = {};
  private busy = false;

  override async onload() {
    const data = (await this.loadData()) as { bases?: Record<string, string> } | null;
    this.bases = data?.bases ?? {};

    this.addRibbonIcon("refresh-cw", "Synchronize vault", () => void this.sync());
    this.addCommand({
      id: "synchronize",
      name: "Synchronize vault",
      callback: () => void this.sync(),
    });
  }

  private async sync() {
    if (this.busy) return;
    this.busy = true;
    try {
      this.bases = await synchronize(this.app.vault, this.bases);
      await this.saveData({ bases: this.bases });
      new Notice("Vault synced");
    } catch (error) {
      console.error(error);
      new Notice(`Sync failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.busy = false;
    }
  }
}
