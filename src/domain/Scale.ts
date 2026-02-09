import { Note } from "./Note";

export enum ScaleType {
  Major = "major",
  NaturalMinor = "natural_minor",
  HarmonicMinor = "harmonic_minor",
  MelodicMinor = "melodic_minor",
}

export class Scale {
  constructor(root: Note, type: ScaleType) {
    if (!Object.values(ScaleType).includes(type)) {
      throw new Error(`Invalid scale type: ${type}`);
    }
    if (!root) {
      throw new Error("Root note is required for a scale");
    }
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
  };

  get notes(): Note[] {
    const intervals = Scale.scaleIntervals[this.type];
    const indexOfRoot = Note.letterCycle.indexOf(this.root.baseLetter);
    const notes: Note[] = [];
    for (let i = 0; i < intervals.length; i++) {
      const noteLetter = Note.letterCycle[(indexOfRoot + i) % 7];
      const semitoneOffset = intervals[i];
      if (noteLetter === undefined || semitoneOffset === undefined) {
        throw new Error(`Invalid scale degree index: ${i}`);
      }
      const pitch = (this.root.pitch + semitoneOffset) % 12;
      const noteName = Note.getNoteName(noteLetter, pitch);
      notes.push(new Note(noteName));
    }
    return notes;
  }

  equals(other: Scale): boolean {
    return this.root.equals(other.root) && this.type === other.type;
  }

  contains(note: Note): boolean {
    return this.notes.some((n) => n.equals(note));
  }
}
