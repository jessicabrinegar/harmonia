
export class Note {
    constructor(name: NoteName) {
        if (!Object.values(NoteName).includes(name)) {
            throw new Error(`Invalid note name: ${name}`);
        }
        this.name = name;
    }
    
    readonly name: NoteName;

    // compare notes by value, not reference
    equals(other: Note): boolean {
        return this.name === other.name;
    }
}

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