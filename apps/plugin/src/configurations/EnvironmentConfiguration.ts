import env from "@env";

export namespace PluginConfiguration {
  export const syncServiceUrl = env.VAULT_SYNC_SERVICE_URL;
  export const vaultPath = env.VAULT_PATH;
}
