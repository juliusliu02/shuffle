import { and, eq } from "drizzle-orm";
import { type Card, createEmptyCard, type Grade, fsrs } from "ts-fsrs";

import type { CardInsert, CardSelect, NoteSelect } from "@/lib/types";
import { db } from "@/server/db";
import { articlesTable } from "@/server/db/schema/articles";
import * as cardsService from "@/server/services/cards";
import * as revlogsService from "@/server/services/revlogs";

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
      last_review: null,
    })),
  );

  return cardsService.createCards(cards);
};

export const reviewCard = async (
  id: number,
  uid: number,
  grade: Grade,
): Promise<CardSelect | null> => {
  const cardData = await cardsService.getCard(id, uid);
  if (cardData.length === 0) {
    return null;
  }

  const oldCard: CardSelect = cardData[0];

  const f = fsrs();
  const { card, log } = f.repeat(oldCard, new Date())[grade];

  await revlogsService.createRevlog(id, uid, log);
  return (await cardsService.updateCard(id, uid, card))[0];
};

export const rollbackCard = async (id: number, uid: number) => {
  const card = await cardsService.getCard(id, uid);
  const revlog = await revlogsService.getLatestRevlog(id);
  if (card.length === 0 || revlog.length === 0 || revlog[0].uid !== uid) {
    return null;
  }

  // change this to return prev card state
  await revlogsService.deleteRevlog(revlog[0].id);
  const f = fsrs();
  const newCard = f.rollback(card[0], revlog[0]);
  return (await cardsService.updateCard(id, uid, newCard))[0];
};
