import { lazy } from "@nimir/shared";
import type { Constructible, DependencyContainer } from "./DependencyContainer.ts";
import { container } from "./DependencyContainer.ts";

export const resolve = <T>(item: Constructible<T>, from: DependencyContainer = container): T => from.get(item);
export const lazyResolve = <T>(item: Constructible<T>, from: DependencyContainer = container): () => T =>
  lazy(() => resolve(item, from));

export const singleton = <T extends Constructible>(target: T) => {
  container.singleton(target);
  return target;
};

export const singletonTo = (container: DependencyContainer) => <T extends Constructible>(target: T) => {
  container.singleton(target);
  return target;
};

export const register = <T extends Constructible>(target: T) => {
  container.register(target);
  return target;
};

export const registerTo = (container: DependencyContainer) => (target: Constructible) => {
  container.register(target);
  return target;
};
