import { EnvironmentConfiguration } from "@server/configurations/EnvironmentConfiguration.ts";

export namespace ClientUrl {
  export const sync = EnvironmentConfiguration.syncthingUrl + "/rest";
}
