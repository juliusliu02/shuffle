import { int, sqliteTable, sqliteView, text } from "drizzle-orm/sqlite-core";
import { eq, relations } from "drizzle-orm";
import { userTable } from "@/server/db/schema/auth";

// stores articles
export const articlesTable = sqliteTable("articles_table", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int()
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull(),
  title: text().notNull(),
  body: text().notNull(),
  source: text(),
});

// stores notes of words (one note to many highlights)
export const notesTable = sqliteTable("notes_table", {
  id: int().primaryKey({ autoIncrement: true }),
  entry: text().notNull(),
  articleId: int()
    .references(() => articlesTable.id)
    .notNull(),
  type: text(),
  context: text().notNull(),
  note: text(),
});

// stores offsets relative to the full text
export const highlightsTable = sqliteTable("highlights_table", {
  id: int().primaryKey({ autoIncrement: true }),
  noteId: int()
    .references(() => notesTable.id, { onDelete: "cascade" })
    .notNull(),
  startOffset: int().notNull(),
  endOffset: int().notNull(),
});

export const notesRelation = relations(notesTable, ({ one, many }) => ({
  article: one(articlesTable, {
    fields: [notesTable.articleId],
    references: [articlesTable.id],
  }),
  highlights: many(highlightsTable),
}));

export const articlesRelation = relations(articlesTable, ({ many }) => ({
  notes: many(notesTable),
}));

export const highlightsRelation = relations(highlightsTable, ({ one }) => ({
  note: one(notesTable, {
    fields: [highlightsTable.noteId],
    references: [notesTable.id],
  }),
}));

export const authorizedNotesView = sqliteView("authorized_notes_view").as(
  (qb) =>
    qb
      .select({
        id: notesTable.id,
        articleId: notesTable.articleId,
        userId: articlesTable.userId,
      })
      .from(notesTable)
      .innerJoin(articlesTable, eq(notesTable.articleId, articlesTable.id)),
);
