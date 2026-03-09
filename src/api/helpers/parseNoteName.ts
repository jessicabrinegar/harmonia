import { err, ok, type Result } from "neverthrow";
import { NoteName } from "../../domain/Note";

const noteNameMap: Map<string, NoteName> = new Map(
  Object.values(NoteName).map((note) => {
    // Replace # with s for URL-friendly keys
    const urlKey = note.replace("#", "s");
    return [urlKey, note] as [string, NoteName];
  }),
);

export function parseNoteName(urlNoteName: string): Result<NoteName, Error> {
  const noteName = noteNameMap.get(urlNoteName);
  if (!noteName) {
    return err(new Error(`Invalid note name in URL: ${urlNoteName}`));
  }
  return ok(noteName);
}
