import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// stores articles
export const articlesTable = sqliteTable("articles_table", {
  id: int().primaryKey({ autoIncrement: true }),
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

/* Models a Range to support [Highlight API]{@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API}.
 */
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
