import { isAbsolute, normalize } from "node:path/posix";

export function sanitize(path: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith(".") && path.length > 1) return undefined;

  path = decodeURIComponent(path).replace(/[\\]/g, "/");
  path = normalize(path).replace(/^\/+/, "");

  if (!path || isAbsolute(path)) return undefined;
  if (path.split("/").some((part) => part === ".." || part.startsWith("."))) return undefined;

  return path;
}
