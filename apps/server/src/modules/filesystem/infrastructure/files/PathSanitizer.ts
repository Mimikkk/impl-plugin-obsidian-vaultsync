import { isAbsolute, normalize } from "@std/path";

const regexes = {
  specialChars: /:|\$|!|'|"|@|\+|`|\||=/g,
  leadingSlashes: /^\/+/,
  backslash: /[\\]/g,
};

export class PathSanitizer {
  static create() {
    return new PathSanitizer();
  }

  private constructor() {}

  sanitize(path: string): { value: string } | { error: "absolute-path" | "path-traversal" } {
    if (path.startsWith(".") && path.length > 1) {
      return { error: "path-traversal" };
    }

    path = decodeURIComponent(path);
    path = path.replace(regexes.specialChars, "");
    path = path.replace(regexes.backslash, "/");
    path = normalize(path);

    path = path.replace(regexes.leadingSlashes, "");

    if (isAbsolute(path)) {
      return { error: "absolute-path" };
    }

    if (path.split("/").includes("..")) {
      return { error: "path-traversal" };
    }

    return { value: path };
  }
}
