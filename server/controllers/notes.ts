import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createNoteWithHighlightSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/schemas/notes";
import * as noteService from "@/server/services/notes";
import * as highlightService from "@/server/services/highlights";
import { NoteWithHighlights } from "@/lib/types";
import { requireAuth } from "@/server/middlewares/auth";

const NoteApp = new Hono()
  .use(requireAuth())
  .post("/", zValidator("json", createNoteWithHighlightSchema), async (c) => {
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
  })
  .put("/:id", zValidator("json", updateNoteSchema), async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id) || id < 1) return c.json({ error: "Invalid id." }, 400);

    const validatedFields = c.req.valid("json");
    await noteService.updateNote(id, validatedFields);
    return c.body(null, 204);
  })
  .delete("/:id", zValidator("param", deleteNoteSchema), async (c) => {
    const { id } = c.req.valid("param");
    await noteService.deleteNote(id);
    return c.body(null, 204);
  });

export default NoteApp;
