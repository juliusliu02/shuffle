import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: int().primaryKey(),
  fullName: text().notNull(),
  username: text().unique().notNull(),
  hashedPassword: text().notNull(),
});

export const sessionTable = sqliteTable("session", {
  id: text().primaryKey(),
  userId: int()
    .notNull()
    .references(() => userTable.id),
  expiresAt: int("expires_at", {
    mode: "timestamp",
  }).notNull(),
});
