import { describe, expect, test } from "bun:test";
import { Chord, ChordQuality } from "../Chord";
import { Note, NoteName } from "../Note";
import { Scale, ScaleType } from "../Scale";

function note(name: NoteName): Note {
  return Note.create(name)._unsafeUnwrap();
}

function scale(root: Note, type: ScaleType): Scale {
  return Scale.create(root, type)._unsafeUnwrap();
}

describe("Scale", () => {
  test("create a scale with valid root and type", () => {
    const root = note(NoteName.C);
    const result = Scale.create(root, ScaleType.Major);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap().root).toBe(root);
    expect(result._unsafeUnwrap().type).toBe(ScaleType.Major);
  });

  test("fails when given an invalid input", () => {
    const invalidType = Scale.create(
      note(NoteName.C),
      "invalid_type" as ScaleType,
    );
    expect(invalidType.isErr()).toBe(true);
    expect(invalidType._unsafeUnwrapErr().message).toBe(
      "Invalid scale type: invalid_type",
    );

    const nullRoot = Scale.create(null as unknown as Note, ScaleType.Major);
    expect(nullRoot.isErr()).toBe(true);
    expect(nullRoot._unsafeUnwrapErr().message).toBe(
      "Root note is required for a scale",
    );
  });

  test("get notes of a scale", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);
    const bMinor = scale(note(NoteName.B), ScaleType.NaturalMinor);
    const cNotes = cMajor.notes._unsafeUnwrap().map((n) => n.name);
    const bMinorNotes = bMinor.notes._unsafeUnwrap().map((n) => n.name);

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
    const fMajor = scale(note(NoteName.F), ScaleType.Major);
    const fNotes = fMajor.notes._unsafeUnwrap().map((n) => n.name);
    const cHarmonicMinor = scale(note(NoteName.C), ScaleType.HarmonicMinor);
    const cHarmMinorNotes = cHarmonicMinor.notes
      ._unsafeUnwrap()
      .map((n) => n.name);
    const dMelodicMinor = scale(note(NoteName.D), ScaleType.MelodicMinor);
    const dMelodMinorNotes = dMelodicMinor.notes
      ._unsafeUnwrap()
      .map((n) => n.name);

    expect(fNotes).toEqual([
      NoteName.F,
      NoteName.G,
      NoteName.A,
      NoteName.BFlat,
      NoteName.C,
      NoteName.D,
      NoteName.E,
    ]);
    expect(cHarmMinorNotes).toEqual([
      NoteName.C,
      NoteName.D,
      NoteName.EFlat,
      NoteName.F,
      NoteName.G,
      NoteName.AFlat,
      NoteName.B,
    ]);
    expect(dMelodMinorNotes).toEqual([
      NoteName.D,
      NoteName.E,
      NoteName.F,
      NoteName.G,
      NoteName.A,
      NoteName.B,
      NoteName.CSharp,
    ]);
  });

  test("compare scales for equality", () => {
    const cMajor1 = scale(note(NoteName.C), ScaleType.Major);
    const cMajor2 = scale(note(NoteName.C), ScaleType.Major);
    const dMajor = scale(note(NoteName.D), ScaleType.Major);
    const cMinor = scale(note(NoteName.C), ScaleType.NaturalMinor);

    expect(cMajor1.equals(cMajor2)).toBe(true);
    expect(cMajor1.equals(dMajor)).toBe(false);
    expect(cMajor1.equals(cMinor)).toBe(false);
  });

  test("check if scale contains specific note", () => {
    const cMajorScale = scale(note(NoteName.C), ScaleType.Major);

    expect(cMajorScale.contains(note(NoteName.DSharp))._unsafeUnwrap()).toBe(
      false,
    );
    expect(cMajorScale.contains(note(NoteName.E))._unsafeUnwrap()).toBe(true);
  });

  test("get degree of a note in the scale", () => {
    const cMajorScale = scale(note(NoteName.C), ScaleType.Major);

    expect(cMajorScale.degreeOf(note(NoteName.D))._unsafeUnwrap()).toBe(2);
    expect(cMajorScale.degreeOf(note(NoteName.E))._unsafeUnwrap()).toBe(3);

    const result = cMajorScale.degreeOf(note(NoteName.FSharp));
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(
      "Note F# is not in the scale",
    );
  });

  test("create mode scale", () => {
    const scaleC = scale(note(NoteName.C), ScaleType.Major);
    const dorianD = scale(note(NoteName.D), ScaleType.Dorian);
    const lydianF = scale(note(NoteName.F), ScaleType.Lydian);

    expect(scaleC.mode(2)._unsafeUnwrap().equals(dorianD)).toBe(true);
    expect(scaleC.mode(4)._unsafeUnwrap().equals(lydianF)).toBe(true);
    expect(scaleC.mode(1)._unsafeUnwrap().equals(scaleC)).toBe(true);
    expect(
      scaleC.notes
        ._unsafeUnwrap()
        .every((n) => dorianD.contains(n)._unsafeUnwrap()),
    ).toBe(true);
  });

  test("err when getting mode of non-major scale", () => {
    const s = scale(note(NoteName.C), ScaleType.MelodicMinor);
    const result = s.mode(2);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(
      "Can only get mode of a major scale.",
    );
  });

  test("chordAt returns correct diatonic triads", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);

    const chord1 = cMajor.chordAt(1)._unsafeUnwrap();
    expect(chord1.root.name).toBe(NoteName.C);
    expect(chord1.quality).toBe(ChordQuality.Major);

    const chord2 = cMajor.chordAt(2)._unsafeUnwrap();
    expect(chord2.root.name).toBe(NoteName.D);
    expect(chord2.quality).toBe(ChordQuality.Minor);

    const chord7 = cMajor.chordAt(7)._unsafeUnwrap();
    expect(chord7.root.name).toBe(NoteName.B);
    expect(chord7.quality).toBe(ChordQuality.Diminished);
  });

  test("chordAt returns err for invalid degree", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);

    expect(cMajor.chordAt(0).isErr()).toBe(true);
    expect(cMajor.chordAt(8).isErr()).toBe(true);
  });

  test("chordAt returns correct diatonic seventh chords for C Major", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);

    const expected: [NoteName, ChordQuality][] = [
      [NoteName.C, ChordQuality.Major7], // I: Cmaj7
      [NoteName.D, ChordQuality.Minor7], // ii: Dm7
      [NoteName.E, ChordQuality.Minor7], // iii: Em7
      [NoteName.F, ChordQuality.Major7], // IV: Fmaj7
      [NoteName.G, ChordQuality.Dominant7], // V: G7
      [NoteName.A, ChordQuality.Minor7], // vi: Am7
      [NoteName.B, ChordQuality.HalfDiminished7], // vii: Bm7b5
    ];

    for (let i = 0; i < expected.length; i++) {
      const chord = cMajor.chordAt(i + 1, 4)._unsafeUnwrap();
      expect(chord.root.name).toBe(expected[i]?.[0]);
      expect(chord.quality).toBe(expected[i]?.[1]);
    }
  });

  test("chordAt with noteCount 4 on C Harmonic Minor degree 1 returns MinorMajor7", () => {
    const cHarmonicMinor = scale(note(NoteName.C), ScaleType.HarmonicMinor);
    const chord = cHarmonicMinor.chordAt(1, 4)._unsafeUnwrap();
    expect(chord.root.name).toBe(NoteName.C);
    expect(chord.quality).toBe(ChordQuality.MinorMajor7);
  });

  test("chordAt with noteCount defaults to triads", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);
    const chord = cMajor.chordAt(1)._unsafeUnwrap();
    expect(chord.quality).toBe(ChordQuality.Major);
  });

  test("chordAt returns err for noteCount less than 3", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);
    expect(cMajor.chordAt(1, 2).isErr()).toBe(true);
  });

  test("romanNumeral for diatonic triads in C major", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);
    const expected = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];

    for (let i = 0; i < expected.length; i++) {
      const chord = cMajor.chordAt(i + 1)._unsafeUnwrap();
      expect(cMajor.romanNumeral(chord)._unsafeUnwrap()).toBe(expected[i]!);
    }
  });

  test("romanNumeral for diatonic 7th chords in C major", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);
    const expected = ["I⁷", "ii⁷", "iii⁷", "IV⁷", "V⁷", "vi⁷", "vii°⁷"];

    for (let i = 0; i < expected.length; i++) {
      const chord = cMajor.chordAt(i + 1, 4)._unsafeUnwrap();
      expect(cMajor.romanNumeral(chord)._unsafeUnwrap()).toBe(expected[i]!);
    }
  });

  test("romanNumeral for augmented chord", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);
    const augChord = Chord.create(
      note(NoteName.C),
      ChordQuality.Augmented,
    )._unsafeUnwrap();
    expect(cMajor.romanNumeral(augChord)._unsafeUnwrap()).toBe("I+");
  });

  test("romanNumeral returns err for note not in scale", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);
    const chord = Chord.create(
      note(NoteName.FSharp),
      ChordQuality.Major,
    )._unsafeUnwrap();
    expect(cMajor.romanNumeral(chord).isErr()).toBe(true);
  });

  test("romanNumeral works with inverted chord", () => {
    const cMajor = scale(note(NoteName.C), ScaleType.Major);
    const chord = cMajor.chordAt(5)._unsafeUnwrap().invert()._unsafeUnwrap();
    expect(chord.inversion).toBe(1);
    expect(cMajor.romanNumeral(chord)._unsafeUnwrap()).toBe("V");
  });
});
