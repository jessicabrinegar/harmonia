export enum IntervalQuality {
  Perfect = "Perfect",
  Major = "Major",
  Minor = "Minor",
  Augmented = "Augmented",
  Diminished = "Diminished",
}

export enum IntervalDegree {
  Unison = 1,
  Second = 2,
  Third = 3,
  Fourth = 4,
  Fifth = 5,
  Sixth = 6,
  Seventh = 7,
  Octave = 8,
}

export class Interval {
  constructor(quality: IntervalQuality, degree: IntervalDegree) {
    if (!Object.values(IntervalQuality).includes(quality)) {
      throw new Error(`Invalid interval quality: ${quality}`);
    }
    if (!Object.values(IntervalDegree).includes(degree)) {
      throw new Error(`Invalid interval degree: ${degree}`);
    }
    if (!Interval.semitoneMap.has(`${quality}-${degree}`)) {
      throw new Error(`Invalid interval combination: ${quality} ${degree}`);
    }
    this.quality = quality;
    this.degree = degree;
  }

  readonly quality: IntervalQuality;
  readonly degree: IntervalDegree;

  private static readonly semitoneMap = new Map<string, number>([
    // Perfect intervals
    [`${IntervalQuality.Perfect}-${IntervalDegree.Unison}`, 0],
    [`${IntervalQuality.Perfect}-${IntervalDegree.Fourth}`, 5],
    [`${IntervalQuality.Perfect}-${IntervalDegree.Fifth}`, 7],
    [`${IntervalQuality.Perfect}-${IntervalDegree.Octave}`, 12],
    // Major intervals
    [`${IntervalQuality.Major}-${IntervalDegree.Second}`, 2],
    [`${IntervalQuality.Major}-${IntervalDegree.Third}`, 4],
    [`${IntervalQuality.Major}-${IntervalDegree.Sixth}`, 9],
    [`${IntervalQuality.Major}-${IntervalDegree.Seventh}`, 11],
    // Minor intervals
    [`${IntervalQuality.Minor}-${IntervalDegree.Second}`, 1],
    [`${IntervalQuality.Minor}-${IntervalDegree.Third}`, 3],
    [`${IntervalQuality.Minor}-${IntervalDegree.Sixth}`, 8],
    [`${IntervalQuality.Minor}-${IntervalDegree.Seventh}`, 10],
    // Augmented intervals (one semitone more than perfect/major)
    [`${IntervalQuality.Augmented}-${IntervalDegree.Unison}`, 1],
    [`${IntervalQuality.Augmented}-${IntervalDegree.Second}`, 3],
    [`${IntervalQuality.Augmented}-${IntervalDegree.Third}`, 5],
    [`${IntervalQuality.Augmented}-${IntervalDegree.Fourth}`, 6],
    [`${IntervalQuality.Augmented}-${IntervalDegree.Fifth}`, 8],
    [`${IntervalQuality.Augmented}-${IntervalDegree.Sixth}`, 10],
    [`${IntervalQuality.Augmented}-${IntervalDegree.Seventh}`, 12],
    [`${IntervalQuality.Augmented}-${IntervalDegree.Octave}`, 13],
    // Diminished intervals (one semitone less than perfect/minor)
    [`${IntervalQuality.Diminished}-${IntervalDegree.Unison}`, -1],
    [`${IntervalQuality.Diminished}-${IntervalDegree.Second}`, 0],
    [`${IntervalQuality.Diminished}-${IntervalDegree.Third}`, 2],
    [`${IntervalQuality.Diminished}-${IntervalDegree.Fourth}`, 4],
    [`${IntervalQuality.Diminished}-${IntervalDegree.Fifth}`, 6],
    [`${IntervalQuality.Diminished}-${IntervalDegree.Sixth}`, 7],
    [`${IntervalQuality.Diminished}-${IntervalDegree.Seventh}`, 9],
    [`${IntervalQuality.Diminished}-${IntervalDegree.Octave}`, 11],
  ]);

  equals(other: Interval): boolean {
    return this.quality === other.quality && this.degree === other.degree;
  }

  get semitones(): number {
    return Interval.semitoneMap.get(`${this.quality}-${this.degree}`)!;
  }
}
