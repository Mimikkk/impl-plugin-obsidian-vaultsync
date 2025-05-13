import { FileEventClient } from "../../../../core/infrastructure/clients/external/FileEventClient.ts";

export class EventService {
  static create(client: FileEventClient = FileEventClient.create()) {
    return new EventService(client);
  }

  private constructor(private readonly client: FileEventClient) {}

  async scan() {
    return await this.client.scan();
  }

  async pool(options?: FileEventClient.PoolOptions): Promise<FileEventClient.Event[]> {
    return await this.client.events(options);
  }

  async latest(): Promise<FileEventClient.Event | undefined> {
    return await this.pool({ since: 0, limit: 1 }).then((events) => events[events.length - 1]);
  }
}
