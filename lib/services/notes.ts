import { db } from "@/lib/db";
import { notesTable } from "@/lib/db/schema";
import { NoteInsert } from "@/lib/models";

export const createNote = async (note: NoteInsert) => {
  return db
    .insert(notesTable)
    .values({
      ...note,
    })
    .returning();
};
