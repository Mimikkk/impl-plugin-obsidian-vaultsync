export namespace EnvironmentConfiguration {
  export const port = +(process.env.SERVER_PORT || "8080");
  export const hostname = process.env.SERVER_HOST || "127.0.0.1";

  export const syncthingUrl = process.env.SYNCTHING_SERVICE_URL!;
  export const syncthingApiKey = process.env.SYNCTHING_SERVICE_API_KEY!;
  export const storageUrl = process.env.STORAGE_URL!;
}
