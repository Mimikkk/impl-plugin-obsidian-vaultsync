import { resolve, singleton } from "@nimir/framework";
import { HealthClient } from "../../../../core/infrastructure/clients/HealthClient.ts";

@singleton
export class HealthService {
  static create(client = resolve(HealthClient)) {
    return new HealthService(client);
  }

  private constructor(private readonly client: HealthClient) {}

  async check() {
    return await this.client.check();
  }
}
