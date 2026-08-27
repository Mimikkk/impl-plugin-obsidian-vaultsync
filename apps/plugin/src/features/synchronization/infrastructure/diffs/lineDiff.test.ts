import { describe, expect, it } from "bun:test";
import { lineDiff } from "./lineDiff.ts";

describe("lineDiff", () => {
  it("marks unchanged lines as same", () => {
    expect(lineDiff("a\nb", "a\nb")).toEqual([
      { kind: "same", text: "a" },
      { kind: "same", text: "b" },
    ]);
  });

  it("marks local-only lines as del and remote-only as add", () => {
    expect(lineDiff("keep\nold", "keep\nnew")).toEqual([
      { kind: "same", text: "keep" },
      { kind: "del", text: "old" },
      { kind: "add", text: "new" },
    ]);
  });
});
