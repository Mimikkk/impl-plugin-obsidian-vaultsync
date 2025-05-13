import { SyncEventClient } from "@plugin/infrastructure/clients/SyncEventClient.ts";
import { ClientState } from "@plugin/presentation/state/ClientState.ts";

export namespace EventService {
  const client = SyncEventClient;
  const state = ClientState.lastSync;

  export async function scan() {
    return await client.scan();
  }

  export async function pool() {
    return await client.events({ since: 0, limit: 100 });
  }
}
