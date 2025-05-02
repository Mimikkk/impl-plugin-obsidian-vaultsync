import type { Plugin } from "obsidian";
import type { Awaitable } from "../shared/types/common.ts";

export const createAdapter = (action: (plugin: Plugin) => Awaitable<unknown>) => action;
