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
});
