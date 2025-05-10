import { LocalStorageParameters } from "@plugin/infrastructure/storage/parameters/LocalStorageParameters.ts";
import { LocalStorage } from "../../infrastructure/storage/LocalStorage.ts";

export namespace State {
  export const lastSeenEventId = LocalStorage.create<number>(
    "lastSeenEventId",
    LocalStorageParameters.number(0),
  );
}
