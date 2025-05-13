import { SyncEventClient } from "@plugin/core/infrastructure/clients/external/SyncEventClient.ts";

export namespace EventService {
  const client = SyncEventClient;

  export async function scan() {
    return await client.scan();
  }

  export interface PoolOptions extends SyncEventClient.PoolOptions {}

  export async function pool(options?: PoolOptions): Promise<SyncEventClient.Event[]> {
    return await client.events(options);
  }

  export async function latest(): Promise<SyncEventClient.Event | undefined> {
    const events = await pool({ since: 0, limit: 1 });
    return events[events.length - 1];
  }
}
