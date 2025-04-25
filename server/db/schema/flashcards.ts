import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Rating, State } from "ts-fsrs";

import { notesTable } from "@/server/db/schema/articles";

export const cardsTable = sqliteTable("cards_table", {
  id: int().primaryKey(),
  nid: int()
    .references(() => notesTable.id)
    .notNull(),
  due: text("timestamp").notNull(),
  stability: real().notNull(),
  difficulty: real().notNull(),
  elapsed_days: int().notNull(),
  scheduled_days: int().notNull(),
  reps: int().notNull(),
  lapses: int().notNull(),
  state: text({
    enum: Object.values(State) as [string, ...string[]],
  }).notNull(),
  last_review: text("timestamp"),
});

export const revLogsTable = sqliteTable("rev_logs_table", {
  id: int().primaryKey(),
  cid: int()
    .references(() => cardsTable.id)
    .notNull(),
  rating: text({
    enum: Object.values(Rating) as [string, ...string[]],
  }).notNull(),
  state: text({
    enum: Object.values(State) as [string, ...string[]],
  }).notNull(),
  due: text("timestamp").notNull(),
  stability: real().notNull(),
  difficulty: real().notNull(),
  elapsed_days: int().notNull(),
  last_elapsed_days: int().notNull(),
  scheduled_days: int().notNull(),
  review: text("timestamp").notNull(),
});
