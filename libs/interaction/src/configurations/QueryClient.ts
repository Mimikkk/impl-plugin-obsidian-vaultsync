import { QueryClient } from "@tanstack/solid-query";

let _client = new QueryClient();

export namespace QueryClientNs {
  export const initialize = (client: QueryClient) => {
    _client = client;
  };

  export const get = () => _client;
  export const cleanup = async () => {
    await _client.cancelQueries();
    _client.clear();
    _client.unmount();
  };
}
