import { describe, expect, test } from "bun:test";
import { Interval, IntervalDegree, IntervalQuality } from "../Interval";

describe("Interval", () => {
  test("create an interval", () => {
    const quality = IntervalQuality.Major;
    const degree = IntervalDegree.Third;

    const result = Interval.create(quality, degree);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap().quality).toBe(quality);
  });

  test("fails when given an invalid quality", () => {
    const result = Interval.create(
      "InvalidQuality" as IntervalQuality,
      IntervalDegree.Second,
    );
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(
      "Invalid interval quality: InvalidQuality",
    );
  });

  test("fails when given an invalid degree", () => {
    const result = Interval.create(IntervalQuality.Minor, 9 as IntervalDegree);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(
      "Invalid interval degree: 9",
    );
  });

  test("equality check", () => {
    const interval1 = Interval.create(
      IntervalQuality.Perfect,
      IntervalDegree.Fifth,
    )._unsafeUnwrap();
    const interval2 = Interval.create(
      IntervalQuality.Perfect,
      IntervalDegree.Fifth,
    )._unsafeUnwrap();
    const interval3 = Interval.create(
      IntervalQuality.Major,
      IntervalDegree.Third,
    )._unsafeUnwrap();

    expect(interval1.equals(interval2)).toBe(true);
    expect(interval1.equals(interval3)).toBe(false);
  });

  test("err for invalid combinations", () => {
    const result = Interval.create(
      IntervalQuality.Perfect,
      IntervalDegree.Third,
    );
    expect(result.isErr()).toBe(true);
  });

  test("return semitone distance", () => {
    const interval = Interval.create(
      IntervalQuality.Major,
      IntervalDegree.Third,
    )._unsafeUnwrap();
    expect(interval.semitones._unsafeUnwrap()).toBe(4);
  });

  test("invert interval", () => {
    const sourceInterval1 = Interval.create(
      IntervalQuality.Major,
      IntervalDegree.Third,
    )._unsafeUnwrap();
    const invertInterval1 = Interval.create(
      IntervalQuality.Minor,
      IntervalDegree.Sixth,
    )._unsafeUnwrap();
    const sourceInterval2 = Interval.create(
      IntervalQuality.Perfect,
      IntervalDegree.Fifth,
    )._unsafeUnwrap();
    const invertInterval2 = Interval.create(
      IntervalQuality.Perfect,
      IntervalDegree.Fourth,
    )._unsafeUnwrap();
    const sourceInterval3 = Interval.create(
      IntervalQuality.Augmented,
      IntervalDegree.Fourth,
    )._unsafeUnwrap();
    const invertInterval3 = Interval.create(
      IntervalQuality.Diminished,
      IntervalDegree.Fifth,
    )._unsafeUnwrap();
    const interval4 = Interval.create(
      IntervalQuality.Perfect,
      IntervalDegree.Unison,
    )._unsafeUnwrap();
    const interval5 = Interval.create(
      IntervalQuality.Perfect,
      IntervalDegree.Octave,
    )._unsafeUnwrap();

    expect(
      sourceInterval1.invert()._unsafeUnwrap().equals(invertInterval1),
    ).toBe(true);
    expect(
      sourceInterval1.semitones._unsafeUnwrap() +
        invertInterval1.semitones._unsafeUnwrap(),
    ).toEqual(12);
    expect(
      sourceInterval2.invert()._unsafeUnwrap().equals(invertInterval2),
    ).toBe(true);
    expect(
      sourceInterval3.invert()._unsafeUnwrap().equals(invertInterval3),
    ).toBe(true);
    expect(interval4.invert()._unsafeUnwrap().equals(interval5)).toBe(true);
    expect(interval5.invert()._unsafeUnwrap().equals(interval4)).toBe(true);
  });

  test("isEnharmonicWith", () => {
    const interval1 = Interval.create(
      IntervalQuality.Diminished,
      IntervalDegree.Third,
    )._unsafeUnwrap();
    const interval2 = Interval.create(
      IntervalQuality.Major,
      IntervalDegree.Second,
    )._unsafeUnwrap();
    const interval3 = Interval.create(
      IntervalQuality.Augmented,
      IntervalDegree.Second,
    )._unsafeUnwrap();
    const interval4 = Interval.create(
      IntervalQuality.Minor,
      IntervalDegree.Third,
    )._unsafeUnwrap();

    expect(interval1.isEnharmonicWith(interval2)._unsafeUnwrap()).toBe(true);
    expect(interval3.isEnharmonicWith(interval4)._unsafeUnwrap()).toBe(true);
    expect(interval1.isEnharmonicWith(interval3)._unsafeUnwrap()).toBe(false);
    expect(interval1.isEnharmonicWith(interval1)._unsafeUnwrap()).toBe(false);
  });
});
