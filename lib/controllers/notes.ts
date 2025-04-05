import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createNoteWithHighlightSchema } from "@/lib/controllers/notes.schema";
import * as noteService from "@/lib/services/notes";
import * as highlightService from "@/lib/services/highlights";
import { NoteWithHighlights } from "@/lib/models";

const NoteApp = new Hono().post(
  "/",
  zValidator("json", createNoteWithHighlightSchema),
  async (c) => {
    const validatedFields = c.req.valid("json");
    const { highlights, ...note } = validatedFields;
    const newNote = (await noteService.createNote(note))[0];
    const newHighlights = await highlightService.createHighlights(
      highlights.map((highlight) => ({ noteId: newNote.id, ...highlight })),
    );
    const noteWithHighlights: NoteWithHighlights = {
      ...newNote,
      highlights: newHighlights,
    };
    return c.json({ note: noteWithHighlights }, 201);
  },
);

export default NoteApp;
