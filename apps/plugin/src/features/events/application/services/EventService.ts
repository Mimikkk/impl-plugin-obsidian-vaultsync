import { resolve, singleton } from "@nimir/framework";
import { EventClient, type EventClientNs } from "../../../../core/infrastructure/clients/EventClient.ts";

@singleton
export class EventService {
  static create(client = resolve(EventClient)) {
    return new EventService(client);
  }

  private constructor(private readonly client: EventClient) {}

  async scan() {
    return await this.client.scan();
  }

  async pool(params?: EventClientNs.PoolParams): Promise<EventClientNs.Event[]> {
    return await this.client.events(params);
  }

  async latest(): Promise<EventClientNs.Event | undefined> {
    return await this.client.latest();
  }
}
