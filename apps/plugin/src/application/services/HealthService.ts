import ky from "ky";
import { ServiceUrl } from "./ServiceUrl.ts";

export namespace HealthService {
  const url = ServiceUrl.sync;

  export interface HealthResponse {
    status: string;
    message: string;
  }

  const healthUrl = url + "/health";
  export const check = () => ky.get<HealthResponse>(healthUrl).json();
}
