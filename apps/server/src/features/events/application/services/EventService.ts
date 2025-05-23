import { resolve, singleton } from "@nimir/framework";
import {
  SyncthingEventClient,
  type SyncthingEventClientNs,
} from "@server/core/infrastructure/clients/SyncthingEventClient.ts";

@singleton
export class EventService {
  static create(client = resolve(SyncthingEventClient)) {
    return new EventService(client);
  }

  private constructor(private readonly client: SyncthingEventClient) {}

  async scan(params: EventServiceNs.ScanParams) {
    return await this.client.scan(params);
  }

  async pool(params?: EventServiceNs.PoolParams): Promise<EventServiceNs.Event[]> {
    return await this.client.events(params);
  }

  async latest(): Promise<EventServiceNs.Event | undefined> {
    return await this.pool({ since: 0, limit: 1 }).then((events) => events[events.length - 1]);
  }
}

export namespace EventServiceNs {
  export interface ScanParams extends SyncthingEventClientNs.ScanParams {}

  export interface PoolParams extends SyncthingEventClientNs.PoolParams {}

  export interface Event extends SyncthingEventClientNs.Event {}
}
