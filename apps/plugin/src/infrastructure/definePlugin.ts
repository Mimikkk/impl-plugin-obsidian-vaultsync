import type { Awaitable } from "@plugin/shared/common-types.ts";
import { Plugin } from "obsidian";

export interface DefinePluginOptions<S> {
  onMount(plugin: Plugin): Awaitable<S>;
  onTeardown(plugin: Plugin, state: S): Awaitable<void>;
}

export const definePlugin = <State>({ onMount, onTeardown }: DefinePluginOptions<State>) => {
  let state: State;

  return class extends Plugin {
    override async onload() {
      state = await onMount(this);
    }

    override async onunload() {
      await onTeardown(this, state);
    }
  };
};
