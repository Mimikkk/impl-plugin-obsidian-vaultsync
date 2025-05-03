import { PluginConfiguration } from "../../configurations/PluginConfiguration.ts";

export namespace ServiceUrl {
  export const sync = PluginConfiguration.syncServiceUrl;
  export const syncthing = PluginConfiguration.syncthingServiceUrl;
}
