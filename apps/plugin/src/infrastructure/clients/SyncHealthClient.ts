import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

export namespace SyncHealthClient {
  const url = ClientUrl.sync;

  export interface HealthResponse {
    status: string;
    message: string;
  }

  const healthUrl = url + "/health";
  export const check = () => ky.get<HealthResponse>(healthUrl).json();
}
