import { and, eq, lte } from "drizzle-orm";

import type { CardInsert, CardSelect } from "@/lib/types";
import { db } from "@/server/db";
import { cardsTable } from "@/server/db/schema/flashcards";

export const createCards = async (data: CardInsert[]) => {
  return db.insert(cardsTable).values(data).returning();
};

export const getDueCards = async (uid: number) => {
  return db
    .select()
    .from(cardsTable)
    .where(and(eq(cardsTable.uid, uid), lte(cardsTable.due, new Date())));
};

export const updateCard = async (data: CardSelect, uid: number) => {
  return db
    .update(cardsTable)
    .set(data)
    .where(and(eq(cardsTable.id, data.id), eq(cardsTable.uid, uid)));
};

export const deleteCard = async (id: number, uid: number) => {
  return db
    .delete(cardsTable)
    .where(and(eq(cardsTable.id, id), eq(cardsTable.id, uid)));
};
