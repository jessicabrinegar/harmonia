import { describe, expect, test } from "bun:test";
import { Chord, ChordQuality } from "../Chord";
import { Note, NoteName } from "../Note";

function note(name: NoteName): Note {
  return Note.create(name)._unsafeUnwrap();
}

describe("Chord", () => {
  test("create chord", () => {
    const n = note(NoteName.C);
    const result = Chord.create(n, ChordQuality.Major);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.root.equals(n)).toBe(true);
      expect(result.value.quality).toBe(ChordQuality.Major);
    }
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
});
