import { colors } from "@cliffy/ansi/colors";
import { Log } from "@server/core/infrastructure/logging/log.ts";
import { HttpJsonResponse } from "@server/core/presentation/messaging/http/responses/HttpJsonResponse.ts";
import { EnvironmentConfiguration } from "./EnvironmentConfiguration.ts";

const c = colors.yellow;
export const ServerConfiguration: Deno.ServeTcpOptions = {
  port: EnvironmentConfiguration.port,
  hostname: EnvironmentConfiguration.hostname,
  onListen({ hostname, port, transport }) {
    Log.info(`Current working directory: ${c(Deno.cwd())}.`);
    Log.info(`Server is running on ${c(`http://${hostname}`)}:${c(port.toString())} using ${c(transport)}.`);
  },
  onError(error) {
    Log.error("Server failed to start:", error);
    return HttpJsonResponse.internal(error);
  },
};
