import { db } from "../db";
import {
  articlesTable,
  authorizedNotesView,
  highlightsTable,
  notesTable,
} from "@/server/db/schema/articles";
import type {
  HighlightInsert,
  NoteInsertWithHighlights,
  NoteWithHighlights,
  Highlight,
  Note,
} from "@/lib/types";
import { and, eq } from "drizzle-orm";
import { type updateNoteSchema } from "@/lib/schemas/notes";
import { type z } from "zod";
import { NotFoundError } from "@/server/utils/error";

export const createNote = async (
  userId: number,
  data: NoteInsertWithHighlights,
): Promise<NoteWithHighlights> => {
  const article = await db
    .select()
    .from(articlesTable)
    .where(
      and(
        eq(articlesTable.userId, userId),
        eq(articlesTable.id, data.articleId),
      ),
    );
  if (article.length === 0) {
    throw new NotFoundError("Article not found");
  }

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
  userId: number,
  data: z.infer<typeof updateNoteSchema>,
): Promise<Note[]> => {
  return db
    .update(notesTable)
    .set(data)
    .from(authorizedNotesView)
    .where(and(eq(notesTable.id, id), eq(authorizedNotesView.userId, userId)))
    .returning();
};

export const deleteNote = async (
  id: number,
  userId: number,
): Promise<Note[]> => {
  const note = await db
    .select()
    .from(authorizedNotesView)
    .where(
      and(
        eq(authorizedNotesView.id, id),
        eq(authorizedNotesView.userId, userId),
      ),
    );

  if (!note) {
    return [];
  }

  return db.delete(notesTable).where(eq(notesTable.id, id)).returning();
};
