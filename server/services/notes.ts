import { db } from "../db";
import { highlightsTable, notesTable } from "@/server/db/schema/articles";
import {
  HighlightInsert,
  NoteInsertWithHighlights,
  NoteWithHighlights,
  Highlight,
} from "@/lib/types";
import { eq } from "drizzle-orm";
import { updateNoteSchema } from "@/lib/schemas/notes";
import { z } from "zod";

export const createNote = async (
  data: NoteInsertWithHighlights,
): Promise<NoteWithHighlights> => {
  const { highlights, ...noteData } = data;

  const note = (
    await db
      .insert(notesTable)
      .values({
        ...noteData,
      })
      .returning()
  )[0];

  const highlightsData: HighlightInsert[] = highlights.map((h) => ({
    ...h,
    noteId: note.id,
  }));
  const newHighlights: Highlight[] = await db
    .insert(highlightsTable)
    .values(highlightsData)
    .returning();
  return { ...note, highlights: newHighlights };
};

export const updateNote = async (
  id: number,
  data: z.infer<typeof updateNoteSchema>,
) => {
  return db
    .update(notesTable)
    .set(data)
    .where(eq(notesTable.id, id))
    .returning();
};

export const deleteNote = async (id: number) => {
  return db
    .delete(notesTable)
    .where(eq(notesTable.id, id))
    .returning({ id: notesTable.id });
};
