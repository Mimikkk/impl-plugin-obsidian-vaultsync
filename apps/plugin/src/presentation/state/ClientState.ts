import { type Plugin, TFolder } from "obsidian";
import { DeletedFiles } from "./values/DeletedFiles.ts";
import { LastSyncTs } from "./values/LastSyncTs.ts";

export namespace ClientState {
  export const lastSync = LastSyncTs.instance;
  export const deleted = DeletedFiles.instance;
  export const localHashes = new Map<string, string>();
  export const remoteHashes = new Map<string, string>();

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

  const serialize = () => {
    return {
      deleted: Array.from(deleted.paths),
      lastSyncTs: lastSync.ts,
      localHashes: Array.from(localHashes.entries()),
      remoteHashes: Array.from(remoteHashes.entries()),
    };
  };

  const deserialize = (data: any) => {
    if (!data) return;

    if (data.deleted && Array.isArray(data.deleted)) {
      deleted.from(data.deleted);
    }

    if (data.lastSyncTs && typeof data.lastSyncTs === "number") {
      lastSync.from(data.lastSyncTs);
    }

    if (data.localHashes && Array.isArray(data.localHashes)) {
      localHashes.clear();

      for (const [key, value] of data.localHashes) {
        localHashes.set(key, value);
      }
    }

    if (data.remoteHashes && Array.isArray(data.remoteHashes)) {
      remoteHashes.clear();

      for (const [key, value] of data.remoteHashes) {
        remoteHashes.set(key, value);
      }
    }
  };

  let _save!: () => Promise<void>;
}
