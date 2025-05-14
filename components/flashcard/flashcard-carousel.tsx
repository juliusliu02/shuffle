import React from "react";

import Flashcard from "@/components/flashcard/index";
import {
  Carousel,
  CarouselBar,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CardWithNoteWithArticle } from "@/lib/types";

type FlashcardCarouselProps = {
  cards: CardWithNoteWithArticle[];
};

const FlashcardCarousel = ({ cards }: FlashcardCarouselProps) => {
  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {cards.map((card) => (
          <CarouselItem key={card.id} className="py-4">
            <Flashcard
              note={card.note}
              title={card.note.article.title}
              source={card.note.article.source}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselBar />
    </Carousel>
  );
};

export default FlashcardCarousel;
