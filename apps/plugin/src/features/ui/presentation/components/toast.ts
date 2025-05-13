import { Notice } from "obsidian";

export const createToast = (message: string) => new Notice(message);
