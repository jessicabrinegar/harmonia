import { describe, expect, test } from "bun:test";
import { Chord, ChordQuality } from "../Chord";
import { Note, NoteName } from "../Note";

function note(name: NoteName): Note {
  return Note.create(name)._unsafeUnwrap();
}

describe("Chord", () => {
  test("create chord", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.equals(n)).toBe(true);
      expect(result.value.quality).toBe(ChordQuality.Major);
    }
  });

  test("equals", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major);
    const result2 = Chord.create(n, ChordQuality.Major);
    expect(result.isOk()).toBe(true);
    expect(result2.isOk()).toBe(true);
    if (result.isOk() && result2.isOk()) {
      expect(result.value.equals(result2.value)).toBe(true);
    }
  });

  test("get notes of a major chord", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.C,
      NoteName.E,
      NoteName.G,
    ]);
  });

  test("get notes of a minor chord", () => {
    const chord = Chord.create(
      note(NoteName.A),
      ChordQuality.Minor,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.A,
      NoteName.C,
      NoteName.E,
    ]);
  });

  test("get notes of a diminished chord", () => {
    const chord = Chord.create(
      note(NoteName.B),
      ChordQuality.Diminished,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.B,
      NoteName.D,
      NoteName.F,
    ]);
  });

  test("get notes of an augmented chord", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Augmented,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.C,
      NoteName.E,
      NoteName.GSharp,
    ]);
  });

  test("get notes of a major 7th chord (Cmaj7)", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major7,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.C,
      NoteName.E,
      NoteName.G,
      NoteName.B,
    ]);
  });

  test("get notes of a minor 7th chord (Am7)", () => {
    const chord = Chord.create(
      note(NoteName.A),
      ChordQuality.Minor7,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.A,
      NoteName.C,
      NoteName.E,
      NoteName.G,
    ]);
  });

  test("get notes of a dominant 7th chord (G7)", () => {
    const chord = Chord.create(
      note(NoteName.G),
      ChordQuality.Dominant7,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.G,
      NoteName.B,
      NoteName.D,
      NoteName.F,
    ]);
  });

  test("get notes of a half-diminished 7th chord (Bm7b5)", () => {
    const chord = Chord.create(
      note(NoteName.B),
      ChordQuality.HalfDiminished7,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.B,
      NoteName.D,
      NoteName.F,
      NoteName.A,
    ]);
  });

  test("get notes of a diminished 7th chord (Bdim7)", () => {
    const chord = Chord.create(
      note(NoteName.B),
      ChordQuality.Diminished7,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.B,
      NoteName.D,
      NoteName.F,
      NoteName.AFlat,
    ]);
  });
});
