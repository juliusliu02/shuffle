"use client";
import React from "react";

import { type Grade, Rating } from "ts-fsrs";

import Flashcard from "@/components/flashcard";
import { Button } from "@/components/ui/button";
import { useReviewDeck } from "@/hooks/use-review-deck";

type ReviewBarProps = {
  reviewCard: (grade: Grade) => void;
};

const ReviewBar = ({ reviewCard }: ReviewBarProps) => {
  return (
    <div className="flex">
      <Button
        variant={"ghost"}
        className={"grow"}
        onClick={() => reviewCard(Rating.Again)}
      >
        Again
      </Button>
      <Button
        variant={"ghost"}
        className={"grow"}
        onClick={() => reviewCard(Rating.Hard)}
      >
        Hard
      </Button>
      <Button
        variant={"ghost"}
        className={"grow"}
        onClick={() => reviewCard(Rating.Good)}
      >
        Good
      </Button>
      <Button
        variant={"ghost"}
        className={"grow"}
        onClick={() => reviewCard(Rating.Easy)}
      >
        Easy
      </Button>
    </div>
  );
};

const ReviewPage = () => {
  const { currentCard, reviewCard, isLoading } = useReviewDeck();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentCard) {
    return <div>There is no card due.</div>;
  }

  return (
    <>
      <Flashcard
        source={currentCard.note.article.source}
        title={currentCard.note.article.title}
        note={currentCard.note}
      />
      <div className="mt-2">
        <ReviewBar reviewCard={reviewCard} />
      </div>
    </>
  );
};

export default ReviewPage;
