import { describe, expect, test } from "bun:test";
import { sanitize } from "./path.ts";

describe("sanitize", () => {
  test("keeps vault-relative paths", () => {
    expect(sanitize("notes/hello.md")).toBe("notes/hello.md");
  });

  test("rejects traversal and dotfiles", () => {
    expect(sanitize("../secret")).toBeUndefined();
    expect(sanitize("foo/../../etc/passwd")).toBeUndefined();
    expect(sanitize(".obsidian/app.json")).toBeUndefined();
  });

  test("strips a leading slash", () => {
    expect(sanitize("/notes/hello.md")).toBe("notes/hello.md");
  });
});
