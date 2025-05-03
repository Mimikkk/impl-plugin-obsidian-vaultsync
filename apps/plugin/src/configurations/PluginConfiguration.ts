import env from "@env";

export namespace PluginConfiguration {
  export const syncServiceUrl = env.VAULT_SYNC_SERVICE_URL;
  export const syncthingServiceUrl = env.SYNCTHING_SERVICE_URL;
  export const syncthingApiKey = env.SYNCTHING_API_KEY;
  export const vaultPath = env.VAULT_PATH;
}
