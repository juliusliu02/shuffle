import { db } from "../db";
import { notesTable } from "@/server/db/schema";
import { NoteInsert } from "@/lib/models";
import { eq } from "drizzle-orm";
import { updateNoteSchema } from "@/lib/schemas/notes";
import { z } from "zod";

export const createNote = async (note: NoteInsert) => {
  return db
    .insert(notesTable)
    .values({
      ...note,
    })
    .returning();
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
