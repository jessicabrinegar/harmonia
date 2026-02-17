import { err, ok, Result } from "neverthrow";
import { Chord, ChordQuality } from "./Chord";
import { Note } from "./Note";

export enum ScaleType {
  Major = "major", // Ionian
  NaturalMinor = "natural_minor",
  HarmonicMinor = "harmonic_minor",
  MelodicMinor = "melodic_minor",
  Dorian = "dorian",
  Phrygian = "phrygian",
  Lydian = "lydian",
  Mixolydian = "mixolydian",
  Locrian = "locrian",
}

export class Scale {
  private constructor(root: Note, type: ScaleType) {
    this.root = root;
    this.type = type;
  }

  readonly root: Note;
  readonly type: ScaleType;

  private static readonly scaleIntervals: Record<ScaleType, number[]> = {
    [ScaleType.Major]: [0, 2, 4, 5, 7, 9, 11], //W-W-H-W-W-W-H
    [ScaleType.NaturalMinor]: [0, 2, 3, 5, 7, 8, 10], //W-H-W-W-H-W-W
    [ScaleType.HarmonicMinor]: [0, 2, 3, 5, 7, 8, 11], //W-H-W-W-H-WH-H
    [ScaleType.MelodicMinor]: [0, 2, 3, 5, 7, 9, 11], //W-H-W-W-W-W-H
    [ScaleType.Dorian]: [0, 2, 3, 5, 7, 9, 10], //W-H-W-W-W-H-W
    [ScaleType.Phrygian]: [0, 1, 3, 5, 7, 8, 10], //H-W-W-W-H-W-W
    [ScaleType.Lydian]: [0, 2, 4, 6, 7, 9, 11], //W-W-W-H-W-W-H
    [ScaleType.Mixolydian]: [0, 2, 4, 5, 7, 9, 10], //W-W-H-W-W-H-W
    [ScaleType.Locrian]: [0, 1, 3, 5, 6, 8, 10], //H-W-W-H-W-W-W
  };

  private static readonly chordQualityMap = new Map<string, ChordQuality>([
    ["4-7", ChordQuality.Major],
    ["3-7", ChordQuality.Minor],
    ["3-6", ChordQuality.Diminished],
    ["4-8", ChordQuality.Augmented],
  ]);

  private static readonly ModeMap = new Map<number, ScaleType>([
    [1, ScaleType.Major], // Ionian
    [2, ScaleType.Dorian],
    [3, ScaleType.Phrygian],
    [4, ScaleType.Lydian],
    [5, ScaleType.Mixolydian],
    [6, ScaleType.NaturalMinor], // Aeolian
    [7, ScaleType.Locrian],
  ]);

  static create(root: Note, type: ScaleType): Result<Scale, Error> {
    if (!Object.values(ScaleType).includes(type)) {
      return err(new Error(`Invalid scale type: ${type}`));
    }
    if (!root) {
      return err(new Error("Root note is required for a scale"));
    }
    return ok(new Scale(root, type));
  }

  get notes(): Result<Note[], Error> {
    const intervals = Scale.scaleIntervals[this.type];
    const indexOfRoot = Note.letterCycle.indexOf(this.root.baseLetter);

    const results = intervals.map((semitoneOffset, i) => {
      const noteLetter = Note.letterCycle[(indexOfRoot + i) % 7];
      if (noteLetter === undefined) {
        return err(new Error(`Invalid scale degree index: ${i}`));
      }
      const pitch = (this.root.pitch + semitoneOffset) % 12;
      return Note.getNoteName(noteLetter, pitch).andThen(Note.create);
    });

    return Result.combine(results);
  }

  equals(other: Scale): boolean {
    return this.root.equals(other.root) && this.type === other.type;
  }

  contains(note: Note): Result<boolean, Error> {
    return this.notes.map((notes) => notes.some((n) => n.equals(note)));
  }

  degreeOf(note: Note): Result<number, Error> {
    return this.notes.andThen((notes) => {
      const index = notes.findIndex((n) => n.equals(note));
      if (index === -1) {
        return err(new Error(`Note ${note.name} is not in the scale`));
      }
      return ok(index + 1);
    });
  }

  // Returns the diatonic triad chord built on the given degree of the scale
  chordAt(degree: number): Result<Chord, Error> {
    if (degree < 1 || degree > 7) {
      return err(new Error("Degree must be between 1 and 7."));
    }
    return this.notes.andThen((notes) => {
      const root = notes[degree - 1]!;
      const third = notes[(degree - 1 + 2) % 7]!;
      const fifth = notes[(degree - 1 + 4) % 7]!;

      const thirdSemitones = (third.pitch - root.pitch + 12) % 12;
      const fifthSemitones = (fifth.pitch - root.pitch + 12) % 12;

      const quality = Scale.chordQualityMap.get(
        `${thirdSemitones}-${fifthSemitones}`,
      );
      if (!quality) {
        return err(
          new Error(
            `Unknown chord quality for intervals ${thirdSemitones}-${fifthSemitones}`,
          ),
        );
      }
      return Chord.create(root, quality);
    });
  }

  mode(degree: number): Result<Scale, Error> {
    if (this.type !== ScaleType.Major) {
      return err(new Error("Can only get mode of a major scale."));
    }
    if (degree < 1 || degree > 7) {
      return err(new Error("Degree must be between 1 and 7."));
    }
    return this.notes.andThen((notes) => {
      const startingNote = notes[degree - 1];
      if (!startingNote) {
        return err(new Error("Unable to get starting note of mode."));
      }
      const scaleType = Scale.ModeMap.get(degree);
      if (!scaleType) {
        return err(new Error("Unable to get scale type of mode."));
      }
      return ok(new Scale(startingNote, scaleType));
    });
  }
}
