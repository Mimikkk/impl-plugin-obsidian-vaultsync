import { describe, expect, test } from "bun:test";
import { plan } from "./plan.ts";

const hashes = (entries: [string, string][]) => new Map(entries);

describe("plan", () => {
  test("local rename is a move, not two files", () => {
    expect(
      plan(hashes([["notes/b.md", "H"]]), hashes([["notes/a.md", "H"]]), { "notes/a.md": "H" }),
    ).toEqual([
      { type: "removeRemote", path: "notes/a.md" },
      { type: "upload", path: "notes/b.md" },
      { type: "forget", path: "notes/a.md" },
    ]);
  });

  test("remote rename is a move, not two files", () => {
    expect(
      plan(hashes([["notes/a.md", "H"]]), hashes([["notes/b.md", "H"]]), { "notes/a.md": "H" }),
    ).toEqual([
      { type: "removeLocal", path: "notes/a.md" },
      { type: "download", path: "notes/b.md" },
      { type: "forget", path: "notes/a.md" },
    ]);
  });

  test("both sides rename the same file to different names is a conflict", () => {
    expect(
      plan(hashes([["notes/b.md", "H"]]), hashes([["notes/c.md", "H"]]), { "notes/a.md": "H" }),
    ).toEqual([
      { type: "conflict", localPath: "notes/b.md", remotePath: "notes/c.md" },
      { type: "forget", path: "notes/a.md" },
    ]);
  });

  test("both sides rename and edit is a conflict", () => {
    expect(
      plan(hashes([["notes/b.md", "L"]]), hashes([["notes/c.md", "R"]]), { "notes/a.md": "H" }),
    ).toEqual([
      { type: "conflict", localPath: "notes/b.md", remotePath: "notes/c.md" },
      { type: "forget", path: "notes/a.md" },
    ]);
  });

  test("same-path content divergence is a conflict", () => {
    expect(plan(hashes([["a.md", "L"]]), hashes([["a.md", "R"]]), { "a.md": "H" })).toEqual([
      { type: "conflict", localPath: "a.md", remotePath: "a.md" },
    ]);
  });
});
