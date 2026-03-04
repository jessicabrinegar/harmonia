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
  private constructor(
    root: Note,
    quality: ChordQuality,
    inversion: number = 0,
  ) {
    this.root = root;
    this.quality = quality;
    this.inversion = inversion;
  }

  readonly root: Note;
  readonly quality: ChordQuality;
  readonly inversion: number = 0;

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

  static create(
    root: Note,
    quality: ChordQuality,
    inversion: number = 0,
  ): Result<Chord, Error> {
    if (!root || !quality) {
      return err(new Error("Root note and chord quality must be provided."));
    }
    if (!Object.values(ChordQuality).includes(quality)) {
      return err(new Error("Invalid chord quality value."));
    }
    const intervals = Chord.chordIntervals.get(quality);
    if (!intervals) {
      return err(
        new Error("No interval data found for the specified chord quality."),
      );
    }
    if (inversion < 0 || inversion > intervals.length) {
      return err(new Error("Invalid inversion value for chord."));
    }
    return ok(new Chord(root, quality, inversion));
  }

  equals(other: Chord): boolean {
    return (
      this.quality === other.quality &&
      this.root === other.root &&
      this.inversion === other.inversion
    );
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
    const notes = [this.root, ...transposedNotes];
    for (let i = 0; i < this.inversion; i++) {
      const noteToInvert = notes.shift();
      if (!noteToInvert) {
        return err(
          new Error("Failed to invert chord notes due to missing note."),
        );
      }
      notes.push(noteToInvert);
    }
    return ok(notes);
  }

  invert(): Result<Chord, Error> {
    const intervals = Chord.chordIntervals.get(this.quality);
    if (!intervals) {
      return err(
        new Error("No interval data found for the specified chord quality."),
      );
    }
    return ok(
      new Chord(
        this.root,
        this.quality,
        (this.inversion + 1) % (intervals.length + 1),
      ),
    );
  }

  static fromNotes(notes: Note[]): Result<Chord, Error> {
    if (notes.length < 3 || notes.length > 4) {
      return err(new Error("Chord identification requires 3 or 4 notes."));
    }
    const inputNames = notes.map((n) => n.name);
    const sortedInput = [...inputNames].sort();

    for (const quality of Object.values(ChordQuality)) {
      const intervals = Chord.chordIntervals.get(quality);
      if (!intervals || intervals.length + 1 !== notes.length) continue;

      for (const potentialRoot of notes) {
        const chordResult = Chord.create(potentialRoot, quality);
        if (chordResult.isErr()) continue;

        const chordNotes = chordResult.value.notes;
        if (chordNotes.isErr()) continue;

        const rootPositionNames = chordNotes.value.map((n) => n.name);
        const sortedRoot = [...rootPositionNames].sort();

        if (sortedInput.every((name, i) => name === sortedRoot[i])) {
          const bassNote = notes[0];
          if (!bassNote) {
            return err(
              new Error("Could not identify chord from the given notes."),
            );
          }
          const inversion = rootPositionNames.findIndex(
            (name) => name === bassNote.name,
          );
          return Chord.create(potentialRoot, quality, inversion);
        }
      }
    }

    return err(new Error("Could not identify chord from the given notes."));
  }

  contains(note: Note): Result<boolean, Error> {
    const chordNotesResult = this.notes;
    if (chordNotesResult.isErr()) {
      return err(new Error("Failed to get chord notes for containment check."));
    }
    return ok(chordNotesResult.value.some((n) => n.equals(note)));
  }
}
