import { LocalStorage } from "../../infrastructure/storage/LocalStorage.ts";

export namespace Memory {
  export const lastSeenEventId = LocalStorage.create<number>("lastSeenEventId", {
    serializer: (value) => value.toString(),
    deserializer: (value) => +(value ?? 0),
  });
}
