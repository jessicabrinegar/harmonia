import { err, ok, type Result } from "neverthrow";
import type { Note } from "./Note";

export enum ChordQuality {
  Major = "major",
  Minor = "minor",
  Diminished = "diminished",
  Augmented = "augmented",
}

export class Chord {
  private constructor(root: Note, quality: ChordQuality) {
    this.root = root;
    this.quality = quality;
  }

  readonly root: Note;
  readonly quality: ChordQuality;

  static create(root: Note, quality: ChordQuality): Result<Chord, Error> {
    if (!Object.values(ChordQuality).includes(quality)) {
      return err(new Error("Invalid chord quality value."));
    }
    if (!root || !quality) {
      return err(new Error("Root note and chord quality must be provided."));
    }
    return ok(new Chord(root, quality));
  }
}
