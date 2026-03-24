import { httpRouter } from "convex/server";
import { parseNoteName } from "../src/api/helpers/parseNoteName";
import { errorResponse, successResponse } from "../src/api/helpers/responses";
import { Note } from "../src/domain/Note";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  pathPrefix: "/notes/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const name = url.pathname.split("/notes/")[1];
    const noteNameParsed = parseNoteName(name);
    if (noteNameParsed.isErr()) {
      return errorResponse(noteNameParsed.error.message, 400);
    }
    const note = Note.create(noteNameParsed.value);
    if (note.isErr()) {
      return errorResponse(note.error.message, 400);
    }
    return successResponse(note.value);
  }),
});

export default http;
