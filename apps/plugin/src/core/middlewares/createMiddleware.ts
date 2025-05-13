import type { Awaitable } from "@nimir/shared";
import type { Plugin } from "obsidian";

export const createMiddleware = (middleware: Middleware) => middleware;
export const composeMiddleware = (...middlewares: Middleware[]) => (plugin: Plugin) => {
  for (const middleware of middlewares) {
    middleware(plugin);
  }
};

export interface Middleware {
  (plugin: Plugin): Awaitable<unknown>;
}
