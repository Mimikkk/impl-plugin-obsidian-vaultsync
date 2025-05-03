import ky from "ky";
import { PluginConfiguration } from "../../configurations/PluginConfiguration.ts";
import { ServiceUrl } from "./ServiceUrl.ts";
import { SyncthingService } from "./SyncthingService.ts";

export namespace VaultSyncService {
  const url = ServiceUrl.sync;
  const vaultPath = PluginConfiguration.vaultPath;

  export interface HealthResponse {
    status: string;
    message: string;
  }

  export interface SyncStatus {
    status: "syncing" | "idle" | "error";
    progress?: number;
    error?: string;
  }

  interface SyncthingFolderStatus {
    inSync: boolean;
    globalBytes: number;
    inSyncBytes: number;
  }

  // Initialize synchronization by setting up the folder in Syncthing
  export const initialize = async () => {
    try {
      // Create a folder for this vault
      const folder = await SyncthingService.createFolder({
        label: "Obsidian Vault",
        path: vaultPath,
        type: "sendreceive",
        devices: [],
      });

      return folder;
    } catch (error) {
      console.error("Failed to initialize sync:", error);
      throw error;
    }
  };

  // Perform a sync operation
  export const sync = async () => {
    try {
      // Get all folders
      const folders = await SyncthingService.getFolders();

      // Find our vault folder
      const vaultFolder = folders.find((f) => f.path === vaultPath);
      if (!vaultFolder) {
        throw new Error("Vault folder not found. Please initialize sync first.");
      }

      // Scan for changes
      await SyncthingService.scanFolder(vaultFolder.id);

      // Get sync status
      const status = await SyncthingService.getFolderStatus(vaultFolder.id);

      return status;
    } catch (error) {
      console.error("Sync failed:", error);
      throw error;
    }
  };

  // Check sync health
  export const health = async () => {
    try {
      const response = await ky.get<HealthResponse>(url + "/health").json();
      return response;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  };

  // Get current sync status
  export const getStatus = async (): Promise<SyncStatus> => {
    try {
      const folders = await SyncthingService.getFolders();
      const vaultFolder = folders.find((f) => f.path === vaultPath);

      if (!vaultFolder) {
        return { status: "idle" };
      }

      const status = await SyncthingService.getFolderStatus(vaultFolder.id) as SyncthingFolderStatus;

      return {
        status: status.inSync ? "idle" : "syncing",
        progress: status.globalBytes ? (status.inSyncBytes / status.globalBytes) * 100 : 0,
      };
    } catch (error) {
      return {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };
}
