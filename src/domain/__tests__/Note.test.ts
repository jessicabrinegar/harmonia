import { describe, expect, test } from "bun:test";
import { Note, NoteName } from "../Note";

describe("Note", () => {
  test("create note with a name", () => {
    const note = new Note(NoteName.C);
    expect(note.name).toBe(NoteName.C);
  });

  test("create note with invalid name should throw error", () => {
    // @ts-expect-error
    expect(() => new Note("Z")).toThrow();
  });

  test("notes with same name should be equal", () => {
    const note1 = new Note(NoteName.D);
    const note2 = new Note(NoteName.D);
    expect(note1.equals(note2)).toBe(true);
  });

  test("notes with different names should not be equal", () => {
    const note1 = new Note(NoteName.E);
    const note2 = new Note(NoteName.F);
    expect(note1.equals(note2)).toBe(false);
  });

  test("check enharmonic equivalence for non-match", () => {
    const note1 = new Note(NoteName.CSharp);
    const note2 = new Note(NoteName.EFlat);
    expect(note1.isEnharmonicWith(note2)).toBe(false);
  });

  test("check enharmonic equivalence for match", () => {
    const note1 = new Note(NoteName.CSharp);
    const note2 = new Note(NoteName.DFlat);
    expect(note1.isEnharmonicWith(note2)).toBe(true);
  });

  test("get base letter from a Note", () => {
    const note = new Note(NoteName.FSharp);
    expect(note.baseLetter).toBe("F");
  });

  test("get note name from base letter and pitch", () => {
    const noteName = Note.getNoteName("C", 1);
    expect(noteName).toBe(NoteName.CSharp);
  });

  test ("get pitch from a Note", () => {
    const note = new Note(NoteName.G);
    expect(note.pitch).toBe(7);
  });
});
