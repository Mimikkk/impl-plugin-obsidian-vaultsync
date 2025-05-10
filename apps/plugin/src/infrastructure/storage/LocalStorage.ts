import { LocalStorageParameter } from "./parameters/LocalStorageParameter.ts";

export namespace LocalStorage {
  export const set = LocalStorageParameter.set;
  export const get = LocalStorageParameter.get;
  export const create = LocalStorageParameter.create;
}
