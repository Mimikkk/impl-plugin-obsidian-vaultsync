import { styleText } from "node:util";
import { Log } from "@server/core/infrastructure/logging/log.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { EnvironmentConfiguration } from "./EnvironmentConfiguration.ts";

const c = (s: string) => styleText("yellow", s);

export const ServerConfiguration = {
  port: EnvironmentConfiguration.port,
  hostname: EnvironmentConfiguration.hostname,
  error(error: unknown) {
    Log.error("Server failed to start:", error);
    return HttpJsonResponse.internal(error);
  },
};

export function logListen(hostname: string, port: number) {
  Log.info(`Current working directory: ${c(process.cwd())}.`);
  Log.info(`Listening on ${c(`${hostname}:${port}`)} (http://127.0.0.1:${port} and LAN).`);
}
