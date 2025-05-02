import type { Awaitable } from "@plugin/shared/commonTypes.ts";
import type { Plugin } from "obsidian";

export const createAdapter = (action: (plugin: Plugin) => Awaitable<unknown>) => action;
