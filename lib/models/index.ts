import {
  articlesTable,
  flashcardsTable,
  highlightsTable,
  notesTable,
  wordsTable,
} from "@/lib/db/schema";

export type Article = typeof articlesTable.$inferSelect;
export type ArticleInsert = typeof articlesTable.$inferInsert;

export type Word = typeof wordsTable.$inferSelect;
export type WordInsert = typeof wordsTable.$inferInsert;

export type Note = typeof notesTable.$inferSelect;
export type NoteInsert = typeof notesTable.$inferInsert;

export type Highlight = typeof highlightsTable.$inferSelect;
export type HighlightInsert = typeof highlightsTable.$inferInsert;

export type Flashcard = typeof flashcardsTable.$inferSelect;
export type FlashcardInsert = typeof flashcardsTable.$inferInsert;
