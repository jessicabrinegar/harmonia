import { describe, expect, test } from "bun:test";
import { Interval, IntervalDegree, IntervalQuality } from "../Interval";
import { Note, NoteName } from "../Note";

function note(name: NoteName): Note {
  return Note.create(name)._unsafeUnwrap();
}

describe("Note", () => {
  test("create note with a name", () => {
    const result = Note.create(NoteName.C);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap().name).toBe(NoteName.C);
  });

  test("create note with invalid name should return err", () => {
    // @ts-expect-error
    const result = Note.create("Z");
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe("Invalid note name: Z");
  });

  test("notes with same name should be equal", () => {
    expect(note(NoteName.D).equals(note(NoteName.D))).toBe(true);
  });

  test("notes with different names should not be equal", () => {
    expect(note(NoteName.E).equals(note(NoteName.F))).toBe(false);
  });

  test("check enharmonic equivalence for non-match", () => {
    expect(note(NoteName.CSharp).isEnharmonicWith(note(NoteName.EFlat))).toBe(
      false,
    );
  });

  test("check enharmonic equivalence for match", () => {
    expect(note(NoteName.CSharp).isEnharmonicWith(note(NoteName.DFlat))).toBe(
      true,
    );
  });

  test("get base letter from a Note", () => {
    expect(note(NoteName.FSharp).baseLetter).toBe("F");
  });

  test("get note name from base letter and pitch", () => {
    const result = Note.getNoteName("C", 1);
    expect(result._unsafeUnwrap()).toBe(NoteName.CSharp);
  });

  test("get pitch from a Note", () => {
    expect(note(NoteName.G).pitch).toBe(7);
  });

  test("transpose a note by an interval", () => {
    const interval1 = Interval.create(
      IntervalQuality.Major,
      IntervalDegree.Third,
    )._unsafeUnwrap();
    const interval2 = Interval.create(
      IntervalQuality.Perfect,
      IntervalDegree.Fifth,
    )._unsafeUnwrap();
    const interval3 = Interval.create(
      IntervalQuality.Minor,
      IntervalDegree.Third,
    )._unsafeUnwrap();

    expect(note(NoteName.C).transpose(interval1)._unsafeUnwrap()).toEqual(
      note(NoteName.E),
    );
    expect(note(NoteName.G).transpose(interval2)._unsafeUnwrap()).toEqual(
      note(NoteName.D),
    );
    expect(note(NoteName.C).transpose(interval3)._unsafeUnwrap()).toEqual(
      note(NoteName.EFlat),
    );
  });
});
