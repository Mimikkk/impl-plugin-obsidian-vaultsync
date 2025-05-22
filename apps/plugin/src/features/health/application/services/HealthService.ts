import { HealthClient } from "../../../../core/infrastructure/clients/HealthClient.ts";

export class HealthService {
  static create(client: HealthClient = HealthClient.create()) {
    return new HealthService(client);
  }

  private constructor(private readonly client: HealthClient) {}

  async check() {
    return await this.client.check();
  }
}
