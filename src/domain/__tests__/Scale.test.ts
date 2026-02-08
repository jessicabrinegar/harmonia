import { describe, expect, test } from "bun:test";
import { Note, NoteName } from "../Note";
import { Scale, ScaleType } from "../Scale";

describe("Scale", () => {
  test("create a scale with valid root and type", () => {
    const root = new Note(NoteName.C);
    const scale = new Scale(root, ScaleType.Major);
    expect(scale.root).toBe(root);
    expect(scale.type).toBe(ScaleType.Major);
  });

  test("fails when given an invalid input", () => {
    expect(
      () => new Scale(new Note(NoteName.C), "invalid_type" as ScaleType),
    ).toThrow("Invalid scale type: invalid_type");
    expect(() => new Scale(null as unknown as Note, ScaleType.Major)).toThrow(
      "Root note is required for a scale",
    );
  });

  test("get notes of a scale", () => {
    const cMajor = new Scale(new Note(NoteName.C), ScaleType.Major);
    const bMinor = new Scale(new Note(NoteName.B), ScaleType.NaturalMinor);
    const cNotes = cMajor.notes.map((note) => note.name);
    const bMinorNotes = bMinor.notes.map((note) => note.name);

    expect(cNotes).toEqual([
      NoteName.C,
      NoteName.D,
      NoteName.E,
      NoteName.F,
      NoteName.G,
      NoteName.A,
      NoteName.B,
    ]);
    expect(bMinorNotes).toEqual([
      NoteName.B,
      NoteName.CSharp,
      NoteName.D,
      NoteName.E,
      NoteName.FSharp,
      NoteName.G,
      NoteName.A,
    ]);
  });

  test("get notes ensuring correct enharmonic spelling", () => {
    const fMajor = new Scale(new Note(NoteName.F), ScaleType.Major);
    const fNotes = fMajor.notes.map((note) => note.name);
    expect(fNotes).toEqual([
      NoteName.F,
      NoteName.G,
      NoteName.A,
      NoteName.BFlat,
      NoteName.C,
      NoteName.D,
      NoteName.E,
    ]);
  });

  test("compare scales for equality", () => {
    const cMajor1 = new Scale(new Note(NoteName.C), ScaleType.Major);
    const cMajor2 = new Scale(new Note(NoteName.C), ScaleType.Major);
    const dMajor = new Scale(new Note(NoteName.D), ScaleType.Major);
    const cMinor = new Scale(new Note(NoteName.C), ScaleType.NaturalMinor);

    expect(cMajor1.equals(cMajor2)).toBe(true);
    expect(cMajor1.equals(dMajor)).toBe(false);
    expect(cMajor1.equals(cMinor)).toBe(false);
  });
});
