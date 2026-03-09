import { describe, expect, test } from "bun:test";
import { NoteName } from "../../domain/Note";
import { parseNoteName } from "../helpers/parseNoteName";

describe("parseNoteName", () => {
  test("parses natural notes", () => {
    const result = parseNoteName("C");
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(NoteName.C);
  });

  test("parses sharp notes using 's' suffix", () => {
    const result = parseNoteName("Cs");
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(NoteName.CSharp);
  });

  test("parses flat notes as-is", () => {
    const result = parseNoteName("Bb");
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(NoteName.BFlat);
  });

  test("returns err for invalid note name", () => {
    const result = parseNoteName("Z");
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(
      "Invalid note name in URL: Z",
    );
  });

  test("returns err for raw '#' in URL", () => {
    const result = parseNoteName("C#");
    expect(result.isErr()).toBe(true);
  });

  test("all natural notes parse correctly", () => {
    for (const name of ["C", "D", "E", "F", "G", "A", "B"]) {
      expect(parseNoteName(name).isOk()).toBe(true);
    }
  });

  test("all sharp notes parse with 's' suffix", () => {
    for (const [url, expected] of [
      ["Cs", NoteName.CSharp],
      ["Ds", NoteName.DSharp],
      ["Fs", NoteName.FSharp],
      ["Gs", NoteName.GSharp],
      ["As", NoteName.ASharp],
    ] as const) {
      const result = parseNoteName(url);
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(expected);
    }
  });

  test("all flat notes parse correctly", () => {
    for (const [url, expected] of [
      ["Db", NoteName.DFlat],
      ["Eb", NoteName.EFlat],
      ["Gb", NoteName.GFlat],
      ["Ab", NoteName.AFlat],
      ["Bb", NoteName.BFlat],
    ] as const) {
      const result = parseNoteName(url);
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(expected);
    }
  });
});
