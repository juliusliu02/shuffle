import { and, eq } from "drizzle-orm";
import { type Card, createEmptyCard, State } from "ts-fsrs";

import type { CardInsert, NoteSelect } from "@/lib/types";
import { db } from "@/server/db";
import { articlesTable } from "@/server/db/schema/articles";
import { createCards } from "@/server/services/cards";

export const initCardsForArticle = async (aid: number, uid: number) => {
  const article = await db.query.articlesTable.findFirst({
    where: and(eq(articlesTable.id, aid), eq(articlesTable.userId, uid)),
    with: {
      notes: true,
    },
  });

  if (!article) {
    return null;
  }

  const { notes } = article;

  const cards: CardInsert[] = notes.map((note: NoteSelect) =>
    createEmptyCard<CardInsert>(new Date(), (c: Card) => ({
      ...c,
      uid: uid,
      nid: note.id,
      state: State[c.state], // cast to enum value
      last_review: null,
    })),
  );

  return createCards(cards);
};

// export const reviewCard = async (id: number) => {};
//
// export const rollbackCard = async (id: number) => {};
