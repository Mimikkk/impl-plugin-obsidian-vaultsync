import { SyncEventClient } from "@plugin/infrastructure/clients/SyncEventClient.ts";

export namespace EventService {
  const client = SyncEventClient;

  export async function scan() {
    return await client.scan();
  }
}
