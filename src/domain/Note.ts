import type { Interval } from "./Interval";

export enum NoteName {
  C = "C",
  CSharp = "C#",
  CFlat = "Cb",
  D = "D",
  DSharp = "D#",
  DFlat = "Db",
  E = "E",
  ESharp = "E#",
  EFlat = "Eb",
  F = "F",
  FSharp = "F#",
  FFlat = "Fb",
  G = "G",
  GSharp = "G#",
  GFlat = "Gb",
  A = "A",
  ASharp = "A#",
  AFlat = "Ab",
  B = "B",
  BSharp = "B#",
  BFlat = "Bb",
}
export class Note {
  constructor(name: NoteName) {
    if (!Object.values(NoteName).includes(name)) {
      throw new Error(`Invalid note name: ${name}`);
    }
    this.name = name;
  }

  readonly name: NoteName;

  private static readonly PITCH_MAP = new Map<NoteName, number>([
    [NoteName.C, 0],
    [NoteName.CSharp, 1],
    [NoteName.DFlat, 1],
    [NoteName.D, 2],
    [NoteName.DSharp, 3],
    [NoteName.EFlat, 3],
    [NoteName.E, 4],
    [NoteName.FFlat, 4],
    [NoteName.ESharp, 5],
    [NoteName.F, 5],
    [NoteName.FSharp, 6],
    [NoteName.GFlat, 6],
    [NoteName.G, 7],
    [NoteName.GSharp, 8],
    [NoteName.AFlat, 8],
    [NoteName.A, 9],
    [NoteName.ASharp, 10],
    [NoteName.BFlat, 10],
    [NoteName.B, 11],
    [NoteName.CFlat, 11],
    [NoteName.BSharp, 0],
  ]);

  public static readonly letterCycle: string[] = [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
  ];

  equals(other: Note): boolean {
    return this.name === other.name;
  }

  isEnharmonicWith(other: Note): boolean {
    return Note.PITCH_MAP.get(this.name) === Note.PITCH_MAP.get(other.name);
  }

  get baseLetter(): string {
    return this.name.charAt(0);
  }

  get pitch(): number {
    const result = Note.PITCH_MAP.get(this.name);
    if (result === undefined) {
      throw new Error(`Pitch not found for note name: ${this.name}`);
    }
    return result;
  }

  transpose(interval: Interval): Note {
    const newPitch = (this.pitch + interval.semitones) % 12;
    const letterIndex = Note.letterCycle.indexOf(this.baseLetter);
    const newNote = Note.letterCycle[(letterIndex + interval.degree - 1) % 7];
    if (!newNote) {
      throw new Error(
        `Invalid transposition: base letter ${this.baseLetter} with interval degree ${interval.degree}`,
      );
    }
    return new Note(Note.getNoteName(newNote, newPitch));
  }

  static getNoteName(letter: string, pitch: number): NoteName {
    const enharmonicNames = Array.from(Note.PITCH_MAP.entries())
      .filter(([_, p]) => p === pitch)
      .map(([n, _]) => n);
    const matchingName = enharmonicNames.find((n) => n[0] === letter);
    if (!matchingName) {
      throw new Error(
        `No note name found for letter ${letter} and pitch ${pitch}`,
      );
    }
    return matchingName;
  }
}
