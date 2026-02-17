import { err, ok, type Result } from "neverthrow";
import { Interval, IntervalDegree, IntervalQuality } from "./Interval";
import type { Note } from "./Note";

export enum ChordQuality {
  Major = "major",
  Minor = "minor",
  Diminished = "diminished",
  Augmented = "augmented",
  Major7 = "major7",
  Minor7 = "minor7",
  Dominant7 = "dominant7",
  HalfDiminished7 = "half_diminished7",
  Diminished7 = "diminished7",
  MinorMajor7 = "minor_major7",
  AugmentedMajor7 = "augmented_major7",
}

export class Chord {
  private constructor(root: Note, quality: ChordQuality) {
    this.root = root;
    this.quality = quality;
  }

  readonly root: Note;
  readonly quality: ChordQuality;

  private static readonly chordIntervals = new Map<
    ChordQuality,
    [IntervalQuality, IntervalDegree][]
  >([
    [
      ChordQuality.Major,
      [
        [IntervalQuality.Major, IntervalDegree.Third],
        [IntervalQuality.Perfect, IntervalDegree.Fifth],
      ],
    ],
    [
      ChordQuality.Minor,
      [
        [IntervalQuality.Minor, IntervalDegree.Third],
        [IntervalQuality.Perfect, IntervalDegree.Fifth],
      ],
    ],
    [
      ChordQuality.Diminished,
      [
        [IntervalQuality.Minor, IntervalDegree.Third],
        [IntervalQuality.Diminished, IntervalDegree.Fifth],
      ],
    ],
    [
      ChordQuality.Augmented,
      [
        [IntervalQuality.Major, IntervalDegree.Third],
        [IntervalQuality.Augmented, IntervalDegree.Fifth],
      ],
    ],
    [
      ChordQuality.Major7,
      [
        [IntervalQuality.Major, IntervalDegree.Third],
        [IntervalQuality.Perfect, IntervalDegree.Fifth],
        [IntervalQuality.Major, IntervalDegree.Seventh],
      ],
    ],
    [
      ChordQuality.Minor7,
      [
        [IntervalQuality.Minor, IntervalDegree.Third],
        [IntervalQuality.Perfect, IntervalDegree.Fifth],
        [IntervalQuality.Minor, IntervalDegree.Seventh],
      ],
    ],
    [
      ChordQuality.Dominant7,
      [
        [IntervalQuality.Major, IntervalDegree.Third],
        [IntervalQuality.Perfect, IntervalDegree.Fifth],
        [IntervalQuality.Minor, IntervalDegree.Seventh],
      ],
    ],
    [
      ChordQuality.HalfDiminished7,
      [
        [IntervalQuality.Minor, IntervalDegree.Third],
        [IntervalQuality.Diminished, IntervalDegree.Fifth],
        [IntervalQuality.Minor, IntervalDegree.Seventh],
      ],
    ],
    [
      ChordQuality.Diminished7,
      [
        [IntervalQuality.Minor, IntervalDegree.Third],
        [IntervalQuality.Diminished, IntervalDegree.Fifth],
        [IntervalQuality.Diminished, IntervalDegree.Seventh],
      ],
    ],
    [
      ChordQuality.MinorMajor7,
      [
        [IntervalQuality.Minor, IntervalDegree.Third],
        [IntervalQuality.Perfect, IntervalDegree.Fifth],
        [IntervalQuality.Major, IntervalDegree.Seventh],
      ],
    ],
    [
      ChordQuality.AugmentedMajor7,
      [
        [IntervalQuality.Major, IntervalDegree.Third],
        [IntervalQuality.Augmented, IntervalDegree.Fifth],
        [IntervalQuality.Major, IntervalDegree.Seventh],
      ],
    ],
  ]);

  static create(root: Note, quality: ChordQuality): Result<Chord, Error> {
    if (!Object.values(ChordQuality).includes(quality)) {
      return err(new Error("Invalid chord quality value."));
    }
    if (!root || !quality) {
      return err(new Error("Root note and chord quality must be provided."));
    }
    return ok(new Chord(root, quality));
  }

  equals(other: Chord): boolean {
    return this.quality === other.quality && this.root === other.root;
  }

  get notes(): Result<Note[], Error> {
    const intervals = Chord.chordIntervals.get(this.quality);
    const transposedNotes: Note[] = [];
    for (const [intervalQuality, intervalDegree] of intervals ?? []) {
      if (!intervalQuality || !intervalDegree) {
        return err(new Error("Invalid interval data for chord quality."));
      }
      const intervalResult = Interval.create(intervalQuality, intervalDegree);
      if (intervalResult.isErr()) {
        return err(new Error("Failed to create interval for chord notes."));
      }
      const interval = intervalResult.value;
      const transposedNoteResult = this.root.transpose(interval);
      if (transposedNoteResult.isErr()) {
        return err(new Error("Failed to transpose root note for chord notes."));
      }
      transposedNotes.push(transposedNoteResult.value);
    }
    return ok([this.root, ...transposedNotes]);
  }
}
