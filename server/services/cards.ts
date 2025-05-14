import { and, asc, eq, lte } from "drizzle-orm";

import type { CardInsert, CardSelect } from "@/lib/types";
import { db } from "@/server/db";
import { cardsTable } from "@/server/db/schema/flashcards";

export const createCards = async (data: CardInsert[]) => {
  return db.insert(cardsTable).values(data).returning();
};

export const getDueCards = async (uid: number) => {
  return db.query.cardsTable.findMany({
    where: and(eq(cardsTable.uid, uid), lte(cardsTable.due, new Date())),
    with: {
      note: {
        with: {
          article: true,
        },
      },
    },
    orderBy: asc(cardsTable.due),
  });
};

export const getCard = async (id: number, uid: number) => {
  return db
    .select()
    .from(cardsTable)
    .where(and(eq(cardsTable.id, id), eq(cardsTable.uid, uid)))
    .limit(1);
};

export const updateCard = async (
  id: number,
  uid: number,
  data: Partial<CardSelect>,
) => {
  return db
    .update(cardsTable)
    .set(data)
    .where(and(eq(cardsTable.id, id), eq(cardsTable.uid, uid)))
    .returning();
};

export const deleteCard = async (id: number, uid: number) => {
  return db
    .delete(cardsTable)
    .where(and(eq(cardsTable.id, id), eq(cardsTable.id, uid)));
};
