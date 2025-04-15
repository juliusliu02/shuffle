import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey(),
  fullName: text().notNull(),
  username: text().unique().notNull(),
  hashedPassword: text().notNull(),
});

export const sessionsTable = sqliteTable("sessions_table", {
  id: text().primaryKey(),
  userId: int()
    .notNull()
    .references(() => usersTable.id),
  expiresAt: int({
    mode: "timestamp",
  }).notNull(),
});
