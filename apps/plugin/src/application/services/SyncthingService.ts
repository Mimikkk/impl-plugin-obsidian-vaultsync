// apps/plugin/src/application/services/SyncthingService.ts
import { PluginConfiguration } from "@plugin/configurations/PluginConfiguration.ts";
import ky from "ky";

export namespace SyncthingService {
  const url = PluginConfiguration.syncServiceUrl + "/sync";
  const headers = {};

  export interface Folder {
    id: string;
    label: string;
    path: string;
    type: "sendreceive" | "sendonly" | "receiveonly";
    devices: Array<{
      deviceID: string;
      introducedBy: string;
    }>;
  }

  export interface Device {
    deviceID: string;
    name: string;
    addresses: string[];
  }

  // Get all folders from Syncthing
  export const getFolders = () => ky.get(`${url}/rest/config/folders`, { headers }).json<Folder[]>();

  // Create a new folder in Syncthing
  export const createFolder = (folder: Omit<Folder, "id">) =>
    ky.post(`${url}/rest/config/folders`, { json: folder }).json();

  // Get all devices from Syncthing
  export const getDevices = async () => ky.get(`${url}/rest/config/devices`, { headers }).json<Device[]>();

  // Add a new device to Syncthing
  export const addDevice = (device: Omit<Device, "deviceID">) =>
    ky.post(`${url}/rest/config/devices`, { json: device }).json();

  // Share a folder with a device
  export const shareFolder = (folderID: string, deviceID: string) =>
    ky.put(`${url}/rest/config/folders/${folderID}/devices/${deviceID}`, { json: { introducedBy: "" } }).json();

  // Get folder status (sync progress, etc.)
  export const getFolderStatus = (folderID: string) => ky.get(`${url}/rest/db/status?folder=${folderID}`).json();

  // Scan a folder for changes
  export const scanFolder = (folderID: string) => ky.post(`${url}/rest/db/scan?folder=${folderID}`).json();
}
