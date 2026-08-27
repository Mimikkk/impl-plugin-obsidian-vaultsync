export namespace EnvironmentConfiguration {
  export const port = +(process.env.SERVER_PORT || "8080");
  export const hostname = process.env.SERVER_HOST || "0.0.0.0";
  export const storageUrl = process.env.STORAGE_URL || "./data";
}
