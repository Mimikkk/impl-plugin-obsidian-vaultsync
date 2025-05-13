import { ExternalClientUrl } from "@plugin/core/infrastructure/clients/external/ExternalClientUrl.ts";
import ky from "ky";

export class SyncHealthClient {
  static create(url: string = ExternalClientUrl.sync) {
    return new SyncHealthClient(url);
  }

  private constructor(private readonly url: string) {}

  check() {
    return ky.get(this.url + "/health").json<SyncHealthClient.HealthResponse>();
  }
}

export namespace SyncHealthClient {
  export interface HealthResponse {
    status: string;
    message: string;
  }
}
