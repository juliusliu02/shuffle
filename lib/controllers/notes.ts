import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createNoteWithHighlightSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/controllers/notes.schema";
import * as noteService from "@/lib/services/notes";
import * as highlightService from "@/lib/services/highlights";
import { NoteWithHighlights } from "@/lib/models";

const NoteApp = new Hono()
  .post("/", zValidator("json", createNoteWithHighlightSchema), async (c) => {
    const validatedFields = c.req.valid("json");
    const { highlights, ...note } = validatedFields;
    try {
      const newNote = (await noteService.createNote(note))[0];
      const newHighlights = await highlightService.createHighlights(
        highlights.map((highlight) => ({ noteId: newNote.id, ...highlight })),
      );
      const noteWithHighlights: NoteWithHighlights = {
        ...newNote,
        highlights: newHighlights,
      };
      return c.json({ note: noteWithHighlights }, 201);
    } catch (error) {
      console.log(error);
      let errorMsg = "An error occurred while creating your note.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      return c.json({ error: errorMsg }, 400);
    }
  })
  .put("/:id", zValidator("json", updateNoteSchema), async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id) || id < 1) return c.json({ error: "Invalid id." }, 400);

    const validatedFields = c.req.valid("json");
    try {
      await noteService.updateNote(id, validatedFields);
      return c.body(null, 204);
    } catch (error) {
      console.log(error);
      let errorMsg = "An error occurred while updating note.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      return c.json({ error: errorMsg }, 400);
    }
  })
  .delete("/:id", zValidator("param", deleteNoteSchema), async (c) => {
    const { id } = c.req.valid("param");
    try {
      await noteService.deleteNote(id);
      return c.body(null, 204);
    } catch (error) {
      console.log(error);
      let errorMsg = "An error occurred while deleting note.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      return c.json({ error: errorMsg }, 400);
    }
  });

export default NoteApp;
