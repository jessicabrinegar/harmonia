import { describe, expect, test } from "bun:test";
import { Interval, IntervalDegree, IntervalQuality } from "../Interval";

describe("Interval", () => {
  test("create an interval", () => {
    const quality = IntervalQuality.Major;
    const degree = IntervalDegree.Third;

    const interval = new Interval(quality, degree);
    expect(interval.quality).toBe(quality);
  });

  test("fails when given an invalid quality", () => {
    expect(
      () =>
        new Interval(
          "InvalidQuality" as IntervalQuality,
          IntervalDegree.Second,
        ),
    ).toThrow("Invalid interval quality: InvalidQuality");
  });

  test("fails when given an invalid degree", () => {
    expect(
      () => new Interval(IntervalQuality.Minor, 9 as IntervalDegree),
    ).toThrow("Invalid interval degree: 9");
  });

  test("equality check", () => {
    const interval1 = new Interval(
      IntervalQuality.Perfect,
      IntervalDegree.Fifth,
    );
    const interval2 = new Interval(
      IntervalQuality.Perfect,
      IntervalDegree.Fifth,
    );
    const interval3 = new Interval(IntervalQuality.Major, IntervalDegree.Third);

    expect(interval1.equals(interval2)).toBe(true);
    expect(interval1.equals(interval3)).toBe(false);
  });

  test("throw for invalid combinations", () => {
    expect(
      () => new Interval(IntervalQuality.Perfect, IntervalDegree.Third),
    ).toThrow();
  });

  test("return semitone distance", () => {
    const interval = new Interval(IntervalQuality.Major, IntervalDegree.Third);
    expect(interval.semitones).toBe(4);
  });

  test("invert interval", () => {
    const sourceInterval1 = new Interval(
      IntervalQuality.Major,
      IntervalDegree.Third,
    );
    const invertInterval1 = new Interval(
      IntervalQuality.Minor,
      IntervalDegree.Sixth,
    );
    const sourceInterval2 = new Interval(
      IntervalQuality.Perfect,
      IntervalDegree.Fifth,
    );
    const invertInterval2 = new Interval(
      IntervalQuality.Perfect,
      IntervalDegree.Fourth,
    );
    const sourceInterval3 = new Interval(
      IntervalQuality.Augmented,
      IntervalDegree.Fourth,
    );
    const invertInterval3 = new Interval(
      IntervalQuality.Diminished,
      IntervalDegree.Fifth,
    );
    const interval4 = new Interval(
      IntervalQuality.Perfect,
      IntervalDegree.Unison,
    );
    const interval5 = new Interval(
      IntervalQuality.Perfect,
      IntervalDegree.Octave,
    );

    expect(sourceInterval1.invert()).toEqual(invertInterval1);
    expect(sourceInterval1.semitones + invertInterval1.semitones).toEqual(12);
    expect(sourceInterval2.invert()).toEqual(invertInterval2);
    expect(sourceInterval3.invert()).toEqual(invertInterval3);
    expect(interval4.invert()).toEqual(interval5);
    expect(interval5.invert()).toEqual(interval4);
  });

  test("isEnharmonicWith", () => {
    const interval1 = new Interval(
      IntervalQuality.Diminished,
      IntervalDegree.Third,
    );
    const interval2 = new Interval(
      IntervalQuality.Major,
      IntervalDegree.Second,
    );
    const interval3 = new Interval(
      IntervalQuality.Augmented,
      IntervalDegree.Second,
    );
    const interval4 = new Interval(IntervalQuality.Minor, IntervalDegree.Third);

    expect(interval1.isEnharmonicWith(interval2)).toBe(true);
    expect(interval3.isEnharmonicWith(interval4)).toBe(true);
    expect(interval1.isEnharmonicWith(interval3)).toBe(false);
    expect(interval1.isEnharmonicWith(interval1)).toBe(false);
  });
});
