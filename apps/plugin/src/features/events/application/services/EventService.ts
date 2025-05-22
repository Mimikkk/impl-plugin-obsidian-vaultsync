import { EventClient, type EventClientNs } from "../../../../core/infrastructure/clients/EventClient.ts";

export class EventService {
  static create(client: EventClient = EventClient.create()) {
    return new EventService(client);
  }

  private constructor(private readonly client: EventClient) {}

  async scan() {
    return await this.client.scan();
  }

  async pool(options?: EventClientNs.PoolOptions): Promise<EventClientNs.Event[]> {
    return await this.client.events(options);
  }

  async latest(): Promise<EventClientNs.Event | undefined> {
    return await this.pool({ since: 0, limit: 1 }).then((events) => events[events.length - 1]);
  }
}
