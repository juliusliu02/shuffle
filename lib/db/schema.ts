import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  note: text(),
});

/* Models a Range to support [Highlight API]{@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API}.
 */
export const highlightsTable = sqliteTable("highlights_table", {
  id: int().primaryKey({ autoIncrement: true }),
  noteId: int()
    .references(() => notesTable.id)
    .notNull(),
  paragraphIndex: int().notNull(),
  sentenceIndex: int().notNull(),
  startOffset: int().notNull(),
  endOffset: int().notNull(),
});

export const flashcardsTable = sqliteTable("flashcards_table", {
  id: int().primaryKey({ autoIncrement: true }),
  noteId: int()
    .references(() => notesTable.id)
    .notNull(),
  word: text().notNull(),
  context: text().notNull(),
});
