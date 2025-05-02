import { relations, sql } from "drizzle-orm";
import { check, index, int, real, sqliteTable } from "drizzle-orm/sqlite-core";

import { notesTable } from "@/server/db/schema/articles";
import { usersTable } from "@/server/db/schema/auth";

export const cardsTable = sqliteTable(
  "cards_table",
  {
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
    state: int().notNull(),
    last_review: int({ mode: "timestamp" }),
  },
  (table) => [
    check(
      "cards_state_check",
      sql`${table.state} >= 0 AND ${table.state} <= 3`, // for enum value
    ),
    index("cards_uid_due_index").on(table.uid, table.due),
  ],
);

export const revlogsTable = sqliteTable(
  "revlogs_table",
  {
    id: int().primaryKey(),
    cid: int()
      .references(() => cardsTable.id)
      .notNull(),
    uid: int()
      .references(() => usersTable.id)
      .notNull(),
    rating: int().notNull(),
    state: int().notNull(),
    due: int({ mode: "timestamp" }).notNull(),
    stability: real().notNull(),
    difficulty: real().notNull(),
    elapsed_days: int().notNull(),
    last_elapsed_days: int().notNull(),
    scheduled_days: int().notNull(),
    review: int({ mode: "timestamp" }).notNull(),
  },
  (table) => [
    check(
      "revlogs_state_check",
      sql`${table.state} >= 0 AND ${table.state} <= 3`, // for enum value
    ),
    check(
      "revlogs_rating_check",
      sql`${table.rating} >= 0 AND ${table.rating} <= 4`, // for enum value
    ),
    index("revlogs_cid_index").on(table.cid),
  ],
);

export const cardsRelation = relations(cardsTable, ({ one }) => ({
  note: one(notesTable, {
    fields: [cardsTable.nid],
    references: [notesTable.id],
  }),
}));
