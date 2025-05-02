import { and, eq, exists } from "drizzle-orm";
import { type z } from "zod";

import { type updateNoteSchema } from "@/lib/schemas/notes";
import type {
  HighlightInsert,
  NoteInsertWithHighlights,
  NoteWithHighlights,
  HighlightSelect,
  NoteSelect,
} from "@/lib/types";
import {
  articlesTable,
  highlightsTable,
  notesTable,
} from "@/server/db/schema/articles";
import { NotFoundError } from "@/server/utils/error";

import { db } from "../db";

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
  const newHighlights: HighlightSelect[] = await db
    .insert(highlightsTable)
    .values(highlightsData)
    .returning();
  return { ...note, highlights: newHighlights };
};

export const updateNote = async (
  id: number,
  userId: number,
  data: z.infer<typeof updateNoteSchema>,
): Promise<NoteSelect[]> => {
  return db
    .update(notesTable)
    .set(data)
    .where(
      and(
        eq(notesTable.id, id),
        exists(
          db
            .select()
            .from(articlesTable)
            .where(
              and(
                eq(articlesTable.id, notesTable.articleId),
                eq(articlesTable.userId, userId),
              ),
            ),
        ),
      ),
    )
    .returning();
};

export const deleteNote = async (id: number, userId: number) => {
  return db.delete(notesTable).where(
    and(
      eq(notesTable.id, id),
      exists(
        db
          .select()
          .from(articlesTable)
          .where(
            and(
              eq(articlesTable.id, notesTable.articleId),
              eq(articlesTable.userId, userId),
            ),
          ),
      ),
    ),
  );
};
