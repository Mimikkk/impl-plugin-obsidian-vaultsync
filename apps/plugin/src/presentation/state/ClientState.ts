import { type Plugin, TFolder } from "obsidian";
import { DeletedFiles } from "./values/DeletedFiles.ts";
import { LastSyncTs } from "./values/LastSyncTs.ts";

export namespace ClientState {
  export const lastSync = LastSyncTs.instance;
  export const deleted = DeletedFiles.instance;

  export const fromPlugin = async (plugin: Plugin) => {
    _save = () => plugin.saveData(serialize());
    const data = await plugin.loadData();

    if (data) {
      deserialize(data);
    } else {
      await _save();
    }

    plugin.registerEvent(plugin.app.vault.on("delete", (file) => {
      if (file instanceof TFolder) return;

      ClientState.deleted.add(file.path, Date.now());
    }));
  };

  export const save = () => _save();

  const serialize = () => ({
    deleted: Array.from(deleted.paths),
    lastSyncTs: lastSync.ts,
  });

  const deserialize = (data: any) => {
    if (!data) return;

    if (data.deleted && Array.isArray(data.deleted)) {
      deleted.from(data.deleted);
    }

    if (data.lastSyncTs && typeof data.lastSyncTs === "number") {
      lastSync.from(data.lastSyncTs);
    }
  };

  let _save!: () => Promise<void>;
}
