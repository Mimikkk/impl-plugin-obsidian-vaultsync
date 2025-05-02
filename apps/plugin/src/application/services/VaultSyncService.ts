import ky from "ky";
import { ServiceUrl } from "./ServiceUrl.ts";

export namespace VaultSyncService {
  const url = ServiceUrl.sync;

  export interface HealthResponse {
    status: string;
    message: string;
  }

  export const health = () => ky.get<HealthResponse>(url + "/health").json();
}
