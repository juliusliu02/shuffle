import type { CardSelect, CardWithNoteWithArticle } from "@/lib/types";

export type JsonifiedDateFields<T> = Omit<T, "due" | "last_review"> & {
  due: string;
  last_review: string | null;
};

export function convertCard<T extends CardSelect | CardWithNoteWithArticle>(
  card: JsonifiedDateFields<T>,
): T {
  return {
    ...card,
    due: new Date(card.due),
    last_review: card.last_review ? new Date(card.last_review) : null,
  } as T;
}
