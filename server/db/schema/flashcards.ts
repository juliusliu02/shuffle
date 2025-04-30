import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Rating, State } from "ts-fsrs";

import { notesTable } from "@/server/db/schema/articles";
import { usersTable } from "@/server/db/schema/auth";

export const cardsTable = sqliteTable("cards_table", {
  id: int().primaryKey(),
  nid: int()
    .references(() => notesTable.id, { onDelete: "cascade" })
    .notNull(),
  uid: int()
    .references(() => usersTable.id)
    .notNull(),
  due: int({ mode: "timestamp" }).notNull(),
  stability: real().notNull(),
  difficulty: real().notNull(),
  elapsed_days: int().notNull(),
  scheduled_days: int().notNull(),
  reps: int().notNull(),
  lapses: int().notNull(),
  state: text({
    enum: Object.values(State) as [string, ...string[]],
  }).notNull(),
  last_review: int({ mode: "timestamp" }),
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
  due: int({ mode: "timestamp" }).notNull(),
  stability: real().notNull(),
  difficulty: real().notNull(),
  elapsed_days: int().notNull(),
  last_elapsed_days: int().notNull(),
  scheduled_days: int().notNull(),
  review: int({ mode: "timestamp" }),
});

export const cardsRelation = relations(cardsTable, ({ one }) => ({
  note: one(notesTable, {
    fields: [cardsTable.nid],
    references: [notesTable.id],
  }),
}));
