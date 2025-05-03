// apps/plugin/src/application/services/SyncthingService.ts
import ky from "ky";
import { PluginConfiguration } from "../../configurations/PluginConfiguration.ts";

export namespace SyncthingService {
  const url = PluginConfiguration.syncthingServiceUrl;
  const key = PluginConfiguration.syncthingApiKey;
  const headers = {
    "X-API-Key": key,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  // Create a custom ky instance with CORS settings
  const api = ky.extend({
    headers,
    retry: {
      limit: 3,
      methods: ["get", "post", "put"],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
  });

  // Helper function to make CORS requests
  const makeRequest = async (method: string, path: string, options: any = {}) => {
    return api[method](path, {
      ...options,
      mode: "cors",
      credentials: "include",
    });
  };

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
  export const getFolders = () => makeRequest("get", `${url}/rest/config/folders`).json<Folder[]>();

  // Create a new folder in Syncthing
  export const createFolder = (folder: Omit<Folder, "id">) =>
    makeRequest("post", `${url}/rest/config/folders`, {
      json: folder,
    }).json();

  // Get all devices from Syncthing
  export const getDevices = () => makeRequest("get", `${url}/rest/config/devices`).json<Device[]>();

  // Add a new device to Syncthing
  export const addDevice = (device: Omit<Device, "deviceID">) =>
    makeRequest("post", `${url}/rest/config/devices`, {
      json: device,
    }).json();

  // Share a folder with a device
  export const shareFolder = (folderID: string, deviceID: string) =>
    makeRequest("put", `${url}/rest/config/folders/${folderID}/devices/${deviceID}`, {
      json: { introducedBy: "" },
    }).json();

  // Get folder status (sync progress, etc.)
  export const getFolderStatus = (folderID: string) =>
    makeRequest("get", `${url}/rest/db/status?folder=${folderID}`).json();

  // Scan a folder for changes
  export const scanFolder = (folderID: string) => makeRequest("post", `${url}/rest/db/scan?folder=${folderID}`).json();
}
