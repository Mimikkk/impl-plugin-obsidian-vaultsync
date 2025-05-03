import ky from "ky";
import { ServiceUrl } from "./ServiceUrl.ts";

export namespace SyncService {
  const url = ServiceUrl.sync + "/sync";

  export const folders = () => ky.get(url + "/config/folders").json();
}
