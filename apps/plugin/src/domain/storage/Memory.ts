import { LocalStorageParameters } from "@plugin/infrastructure/storage/LocalStorageParameters.ts";
import { LocalStorage } from "../../infrastructure/storage/LocalStorage.ts";

export namespace Memory {
  export const lastSeenEventId = LocalStorage.create<number>(
    "lastSeenEventId",
    LocalStorageParameters.number(0),
  );

  export const lastUpdatedTimestamp = LocalStorage.create<number>(
    "lastUpdatedTimestamp",
    LocalStorageParameters.number(0),
  );
}
