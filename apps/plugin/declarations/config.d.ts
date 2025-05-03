declare module "@env" {
  const env: {
    VAULT_SYNC_SERVICE_URL: string;
    SYNCTHING_SERVICE_URL: string;
    SYNCTHING_API_KEY: string;
    VAULT_PATH: string;
  };
  export default env;
}
