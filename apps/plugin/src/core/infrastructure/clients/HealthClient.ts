import ky from "ky";
import { ExternalClientUrl } from "./ExternalClientUrl.ts";

import { singleton } from "@nimir/framework";

@singleton
export class HealthClient {
  static create(url: string = ExternalClientUrl.sync) {
    return new HealthClient(url);
  }

  private constructor(private readonly url: string) {}

  check() {
    return ky.get(this.url + "/health").json<HealthClientNs.HealthResponse>();
  }
}

export namespace HealthClientNs {
  export interface HealthResponse {
    status: string;
    message: string;
  }
}
