import { ExternalClientUrl } from "@plugin/core/infrastructure/clients/external/ExternalClientUrl.ts";
import ky from "ky";

export namespace SyncHealthClient {
  const url = ExternalClientUrl.sync;

  export interface HealthResponse {
    status: string;
    message: string;
  }

  const healthUrl = url + "/health";
  export const check = () => ky.get<HealthResponse>(healthUrl).json();
}
