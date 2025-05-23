import { lazy } from "@nimir/shared";
import type { Constructible, DependencyContainer } from "./DependencyContainer.ts";
import { container } from "./DependencyContainer.ts";

export const resolve = <T>(item: Constructible<T>, from: DependencyContainer = container): T => from.get(item);
export const lazyResolve = <T>(item: Constructible<T>, from: DependencyContainer = container): () => T =>
  lazy(() => resolve(item, from));

export const singleton = <T>(target: Constructible<T>) => {
  container.singleton(target);
};

export const singletonTo = (container: DependencyContainer) => <T>(target: Constructible<T>) => {
  container.singleton(target);
};

export const register = <T>(target: Constructible<T>) => {
  container.register(target);
};

export const registerTo = (container: DependencyContainer) => <T>(target: Constructible<T>) => {
  container.register(target);
};
