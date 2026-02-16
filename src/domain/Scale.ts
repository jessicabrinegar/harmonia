import { Note, NoteName } from "./Note";

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
    [ScaleType.Dorian]: [0, 2, 3, 5, 7, 9, 10], //W-H-W-W-W-H-W
    [ScaleType.Phrygian]: [0, 1, 3, 5, 7, 8, 10], //H-W-W-W-H-W-W
    [ScaleType.Lydian]: [0, 2, 4, 6, 7, 9, 11], //W-W-W-H-W-W-H
    [ScaleType.Mixolydian]: [0, 2, 4, 5, 7, 9, 10], //W-W-H-W-W-H-W
    [ScaleType.Locrian]: [0, 1, 3, 5, 6, 8, 10], //H-W-W-H-W-W-W
  };

  private static readonly ModeMap = new Map<number, ScaleType>([
    [1, ScaleType.Major], // Ionian
    [2, ScaleType.Dorian],
    [3, ScaleType.Phrygian],
    [4, ScaleType.Lydian],
    [5, ScaleType.Mixolydian],
    [6, ScaleType.NaturalMinor], // Aeolian
    [7, ScaleType.Locrian],
  ]);

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
  // Calculate what scale degree a note is on the scale
  degreeOf(note: Note): number {
    const index = this.notes.findIndex((n) => n.equals(note));
    if (index === -1) {
      throw new Error(`Note ${note.name} is not in the scale`);
    }
    return index + 1;
  }

  mode(degree: number): Scale {
    if (degree < 1 || degree > 7)
      throw new Error("Degree must be between 1 and 7.");
    const startingNote = this.notes[degree - 1];
    if (!startingNote) throw new Error("Unable to get starting note of mode.");
    const scaleType = Scale.ModeMap.get(degree);
    if (!scaleType) throw new Error("Unable to get scale type of mode.");
    return new Scale(startingNote, scaleType);
  }
}
