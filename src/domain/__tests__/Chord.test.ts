import { describe, expect, test } from "bun:test";
import { Chord, ChordQuality } from "../Chord";
import { Note, NoteName } from "../Note";

function note(name: NoteName): Note {
  return Note.create(name)._unsafeUnwrap();
}

describe("Chord", () => {
  test("create chord in root position", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.equals(n)).toBe(true);
      expect(result.value.quality).toBe(ChordQuality.Major);
    }
  });

  test("create chord in first inversion", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major, 1);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.equals(n)).toBe(true);
      expect(result.value.quality).toBe(ChordQuality.Major);
      expect(result.value.inversion).toBe(1);
    }
  });

  test("create chord in second inversion", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major, 2);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.inversion).toBe(2);
    }
  });

  test("create 7th chord in third inversion", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major7, 3);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.inversion).toBe(3);
    }
  });

  test("reject inversion beyond triad range", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major, 3);

    expect(result.isErr()).toBe(true);
  });

  test("reject inversion beyond 7th chord range", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major7, 4);

    expect(result.isErr()).toBe(true);
  });

  test("reject negative inversion", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major, -1);

    expect(result.isErr()).toBe(true);
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

  test("notes of a major chord in first inversion", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
      1,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.E,
      NoteName.G,
      NoteName.C,
    ]);
  });

  test("notes of a major chord in second inversion", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
      2,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.G,
      NoteName.C,
      NoteName.E,
    ]);
  });

  test("notes of a 7th chord in first inversion", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major7,
      1,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.E,
      NoteName.G,
      NoteName.B,
      NoteName.C,
    ]);
  });

  test("notes of a 7th chord in third inversion", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major7,
      3,
    )._unsafeUnwrap();
    const notes = chord.notes._unsafeUnwrap();
    expect(notes.map((n) => n.name)).toEqual([
      NoteName.B,
      NoteName.C,
      NoteName.E,
      NoteName.G,
    ]);
  });

  test("invert triad from root position to first inversion", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
    )._unsafeUnwrap();
    const inverted = chord.invert()._unsafeUnwrap();
    expect(inverted.inversion).toBe(1);
    expect(inverted.root.equals(note(NoteName.C))).toBe(true);
    expect(inverted.notes._unsafeUnwrap().map((n) => n.name)).toEqual([
      NoteName.E,
      NoteName.G,
      NoteName.C,
    ]);
  });

  test("invert triad wraps back to root position", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
      2,
    )._unsafeUnwrap();
    const inverted = chord.invert()._unsafeUnwrap();
    expect(inverted.inversion).toBe(0);
    expect(inverted.notes._unsafeUnwrap().map((n) => n.name)).toEqual([
      NoteName.C,
      NoteName.E,
      NoteName.G,
    ]);
  });

  test("invert 7th chord wraps back to root position", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major7,
      3,
    )._unsafeUnwrap();
    const inverted = chord.invert()._unsafeUnwrap();
    expect(inverted.inversion).toBe(0);
    expect(inverted.notes._unsafeUnwrap().map((n) => n.name)).toEqual([
      NoteName.C,
      NoteName.E,
      NoteName.G,
      NoteName.B,
    ]);
  });

  test("chaining invert cycles through all inversions", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
    )._unsafeUnwrap();
    const first = chord.invert()._unsafeUnwrap();
    const second = first.invert()._unsafeUnwrap();
    const back = second.invert()._unsafeUnwrap();
    expect(first.inversion).toBe(1);
    expect(second.inversion).toBe(2);
    expect(back.inversion).toBe(0);
  });

  test("identify major chord in root position from notes", () => {
    const result = Chord.fromNotes([
      note(NoteName.C),
      note(NoteName.E),
      note(NoteName.G),
    ]);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.name).toBe(NoteName.C);
      expect(result.value.quality).toBe(ChordQuality.Major);
      expect(result.value.inversion).toBe(0);
    }
  });

  test("identify major chord in first inversion from notes", () => {
    const result = Chord.fromNotes([
      note(NoteName.E),
      note(NoteName.G),
      note(NoteName.C),
    ]);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.name).toBe(NoteName.C);
      expect(result.value.quality).toBe(ChordQuality.Major);
      expect(result.value.inversion).toBe(1);
    }
  });

  test("identify major chord in second inversion from notes", () => {
    const result = Chord.fromNotes([
      note(NoteName.G),
      note(NoteName.C),
      note(NoteName.E),
    ]);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.name).toBe(NoteName.C);
      expect(result.value.quality).toBe(ChordQuality.Major);
      expect(result.value.inversion).toBe(2);
    }
  });

  test("identify minor chord from notes", () => {
    const result = Chord.fromNotes([
      note(NoteName.A),
      note(NoteName.C),
      note(NoteName.E),
    ]);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.name).toBe(NoteName.A);
      expect(result.value.quality).toBe(ChordQuality.Minor);
      expect(result.value.inversion).toBe(0);
    }
  });

  test("identify 7th chord from notes", () => {
    const result = Chord.fromNotes([
      note(NoteName.C),
      note(NoteName.E),
      note(NoteName.G),
      note(NoteName.B),
    ]);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.name).toBe(NoteName.C);
      expect(result.value.quality).toBe(ChordQuality.Major7);
      expect(result.value.inversion).toBe(0);
    }
  });

  test("identify 7th chord in second inversion from notes", () => {
    const result = Chord.fromNotes([
      note(NoteName.G),
      note(NoteName.B),
      note(NoteName.C),
      note(NoteName.E),
    ]);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.name).toBe(NoteName.C);
      expect(result.value.quality).toBe(ChordQuality.Major7);
      expect(result.value.inversion).toBe(2);
    }
  });

  test("reject unrecognized notes", () => {
    const result = Chord.fromNotes([
      note(NoteName.C),
      note(NoteName.D),
      note(NoteName.A),
    ]);
    expect(result.isErr()).toBe(true);
  });

  test("reject too few notes", () => {
    const result = Chord.fromNotes([note(NoteName.C), note(NoteName.E)]);
    expect(result.isErr()).toBe(true);
  });

  test("contains returns true for note in chord", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
    )._unsafeUnwrap();
    expect(chord.contains(note(NoteName.E))._unsafeUnwrap()).toBe(true);
  });

  test("contains returns false for note not in chord", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
    )._unsafeUnwrap();
    expect(chord.contains(note(NoteName.F))._unsafeUnwrap()).toBe(false);
  });

  test("contains works with inverted chord", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
      1,
    )._unsafeUnwrap();
    expect(chord.contains(note(NoteName.C))._unsafeUnwrap()).toBe(true);
    expect(chord.contains(note(NoteName.E))._unsafeUnwrap()).toBe(true);
    expect(chord.contains(note(NoteName.G))._unsafeUnwrap()).toBe(true);
    expect(chord.contains(note(NoteName.F))._unsafeUnwrap()).toBe(false);
  });

  test("toString for major chord", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
    )._unsafeUnwrap();
    expect(chord.toString()).toBe("C");
  });

  test("toString for minor chord", () => {
    const chord = Chord.create(
      note(NoteName.A),
      ChordQuality.Minor,
    )._unsafeUnwrap();
    expect(chord.toString()).toBe("Am");
  });

  test("toString for dominant 7th chord", () => {
    const chord = Chord.create(
      note(NoteName.G),
      ChordQuality.Dominant7,
    )._unsafeUnwrap();
    expect(chord.toString()).toBe("G7");
  });

  test("toString for diminished chord", () => {
    const chord = Chord.create(
      note(NoteName.B),
      ChordQuality.Diminished,
    )._unsafeUnwrap();
    expect(chord.toString()).toBe("Bdim");
  });

  test("toString with sharp root", () => {
    const chord = Chord.create(
      note(NoteName.FSharp),
      ChordQuality.Minor,
    )._unsafeUnwrap();
    expect(chord.toString()).toBe("F#m");
  });

  test("toString with flat root", () => {
    const chord = Chord.create(
      note(NoteName.BFlat),
      ChordQuality.Major7,
    )._unsafeUnwrap();
    expect(chord.toString()).toBe("Bbmaj7");
  });

  test("toString with first inversion shows slash notation", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
      1,
    )._unsafeUnwrap();
    expect(chord.toString()).toBe("C/E");
  });

  test("toString with second inversion shows slash notation", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major,
      2,
    )._unsafeUnwrap();
    expect(chord.toString()).toBe("C/G");
  });

  test("toString with inverted 7th chord shows slash notation", () => {
    const chord = Chord.create(
      note(NoteName.C),
      ChordQuality.Major7,
      3,
    )._unsafeUnwrap();
    expect(chord.toString()).toBe("Cmaj7/B");
  });
});
