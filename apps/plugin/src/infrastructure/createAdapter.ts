import type { Awaitable } from "@nimir/shared";
import type { Plugin } from "obsidian";

export const createAdapter = (action: (plugin: Plugin) => Awaitable<unknown>) => action;
