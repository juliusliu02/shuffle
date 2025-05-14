import { useState } from "react";

import type { InferRequestType } from "hono";
import { toast } from "sonner";
import useSWR, { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { type Rating } from "ts-fsrs";

import { appClient } from "@/lib/rpc/app-cli";
import type { CardWithNoteWithArticle } from "@/lib/types";
import { convertCard, type JsonifiedDateFields } from "@/lib/utils/card";
import { tomorrow } from "@/lib/utils/date";

const $post = appClient.cards[":id"].$post;

const fetcher = async () => {
  const result: JsonifiedDateFields<CardWithNoteWithArticle>[] = await (
    await appClient.cards.$get()
  ).json();
  return result
    .map(convertCard)
    .sort((a, b) => a.due.valueOf() - b.due.valueOf());
};

const mutate = async (
  _key: string,
  { arg }: { arg: InferRequestType<typeof $post> },
) => {
  const data = await (await $post(arg)).json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return convertCard(data.card);
};

export const useReviewDeck = () => {
  const [reviewedCards, setReviewedCards] = useState<CardWithNoteWithArticle[]>(
    [],
  );

  const { data: dueCards = [], isLoading } = useSWR("/api/cards", fetcher);

  const { trigger } = useSWRMutation(
    `/api/cards/${dueCards[0]?.id ?? "-1"}`,
    mutate,
  );

  const reviewCard = async (rating: Rating) => {
    if (dueCards.length === 0) {
      return;
    }

    await trigger(
      {
        param: {
          id: dueCards[0].id.toString(),
        },
        json: {
          rating: rating,
        },
      },
      {
        onSuccess: (newCard) => {
          setReviewedCards((prev) => [...prev, dueCards[0]]);
          globalMutate(
            `/api/cards`,
            (
              old: CardWithNoteWithArticle[] | undefined,
            ): CardWithNoteWithArticle[] | undefined => {
              if (!old || !newCard) return old;
              const [oldCard, ...rest] = old;

              // if not due today, don't add it.
              if (newCard.due > tomorrow()) return rest;

              const i = rest.findIndex((c) => c.due > newCard.due);
              if (i === -1) {
                rest.push({ ...newCard, note: oldCard.note });
              } else {
                rest.splice(i, 0, { ...newCard, note: oldCard.note });
              }
              return rest;
            },
            false,
          );
        },
        onError: (error: Error) => {
          toast.error(error.message);
          console.log(error);
        },
      },
    );
  };

  const rollbackCard = () => {
    if (reviewedCards.length === 0) {
      return;
    }
    console.log("rollback card " + reviewedCards[reviewedCards.length - 1]);
    setReviewedCards((prev) => prev.slice(0, reviewedCards.length - 1));
  };

  return {
    currentCard: dueCards.length > 0 ? dueCards[0] : null,
    isLoading,
    reviewCard,
    rollbackCard,
  };
};
