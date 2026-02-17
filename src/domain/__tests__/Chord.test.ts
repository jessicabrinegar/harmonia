import { describe, expect, test } from "bun:test";
import { Chord, ChordQuality } from "../Chord";
import { Note, NoteName } from "../Note";

describe("Chord", () => {
  test("create chord", () => {
    const note = new Note(NoteName.C);
    const result = Chord.create(note, ChordQuality.Major);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.equals(note)).toBe(true);
      expect(result.value.quality).toBe(ChordQuality.Major);
    }
  });
});
