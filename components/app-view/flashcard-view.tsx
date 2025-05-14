import React, { useContext } from "react";

import Flashcard from "@/components/flashcard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselBar,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ViewContext from "@/contexts/ViewContext";
import type { ArticleWithNotesAndHighlights } from "@/lib/types";

type FlashcardViewProps = {
  article: ArticleWithNotesAndHighlights;
};

const FlashcardView = ({ article }: FlashcardViewProps) => {
  const viewContext = useContext(ViewContext);
  if (!viewContext) {
    throw new Error("No viewContext provided");
  }

  const { toggleView } = viewContext;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full max-w-2xl">
      <Carousel>
        <CarouselContent>
          {article.notes.map((note) => (
            <CarouselItem key={note.id} className="py-4">
              <Flashcard
                note={note}
                title={article.title}
                source={article.source}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-between">
          <CarouselBar />
          <Button
            className="text-muted-foreground"
            variant={"ghost"}
            onClick={toggleView}
          >
            See full text
          </Button>
        </div>
      </Carousel>
    </div>
  );
};

export default FlashcardView;
