import { di } from "@nimir/framework";
import { type HealthClient, THealthClient } from "../../../../core/infrastructure/clients/HealthClient.ts";

export class HealthService {
  static create(client = di.of(THealthClient)) {
    return new HealthService(client);
  }

  private constructor(private readonly client: HealthClient) {}

  async check() {
    return await this.client.check();
  }
}

export const THealthService = di.singleton(HealthService);
