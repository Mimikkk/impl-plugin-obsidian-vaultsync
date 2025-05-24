import ky from "ky";
import { ClientUrl } from "./ClientUrl.ts";

import { singleton } from "@nimir/framework";

@singleton
export class HealthClient {
  static create(url: string = ClientUrl.sync + "/health") {
    return new HealthClient(url);
  }

  private constructor(private readonly url: string) {}

  check() {
    return ky.get(this.url)
      .json<HealthClientNs.HealthResponse>();
  }
}

export namespace HealthClientNs {
  export interface HealthResponse {
    status: string;
    message: string;
  }
}
