import React from "react";

import { Mark } from "@/components/typography";
import {
  type ArticleWithNotesAndHighlights,
  type Highlight,
  type NoteWithHighlights,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type WithClass = {
  className?: string;
};

type ParagraphProps = {
  text: string;
  highlights: Highlight[];
};

type ArticleProps = {
  article: ArticleWithNotesAndHighlights;
  ref: React.Ref<HTMLDivElement>;
};

const Title = ({ children, className }: React.PropsWithChildren<WithClass>) => {
  return (
    <h1 className={cn("font-serif capitalize font-bold", className)}>
      {children}
    </h1>
  );
};

const Source = ({
  children,
  className,
}: React.PropsWithChildren<WithClass>) => {
  return (
    <p className={cn("text-muted-foreground italic", className)}>{children}</p>
  );
};

const getLocalHighlights = (
  startIndex: number,
  endIndex: number,
  globalHighlights: Highlight[],
): Highlight[] => {
  const localHighlights: Highlight[] = [];

  for (const global of globalHighlights) {
    // get highlights in range
    if (global.endOffset <= startIndex || global.startOffset >= endIndex) {
      continue;
    }
    // trim at the edges
    const localStart: number = Math.max(0, global.startOffset - startIndex);
    const localEnd: number = Math.min(endIndex, global.endOffset) - startIndex;
    // doesn't handle backward selection yet
    if (localStart < localEnd) {
      localHighlights.push({
        ...global,
        startOffset: localStart,
        endOffset: localEnd,
      });
    }
  }

  return localHighlights;
};

const getHighlightedText = (
  text: string,
  highlights: Highlight[],
): React.ReactNode[] => {
  if (!highlights || highlights.length === 0) {
    return [text]; // no highlights => just return the text as is
  }

  // Sort by start offset to process sequentially
  const sorted: Highlight[] = [...highlights].sort(
    (a: Highlight, b: Highlight) => a.startOffset - b.startOffset,
  );

  const result: React.ReactNode[] = [];
  let cursor: number = 0;

  sorted.forEach((hl: Highlight, index: number) => {
    const { startOffset, endOffset, noteId, id } = hl;

    // Push any non-highlighted text before this highlight
    if (cursor < startOffset) {
      result.push(text.slice(cursor, startOffset));
    }

    // Push the highlighted text
    result.push(
      <Mark key={index} data-note-id={noteId} data-highlight-id={id}>
        {text.slice(startOffset, endOffset)}
      </Mark>,
    );

    // Advance the cursor
    cursor = endOffset;
  });

  // Append any remaining text after the last highlight
  if (cursor < text.length) {
    result.push(text.slice(cursor));
  }

  return result;
};

const Paragraph = ({ text, highlights }: ParagraphProps) => {
  const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
  const segments = [...segmenter.segment(text)];

  let runningIndex = 0;
  return (
    <p>
      {segments.map((segment, i) => {
        const localHighlights: Highlight[] = getLocalHighlights(
          runningIndex,
          runningIndex + segment.segment.length,
          highlights,
        );
        runningIndex += segment.segment.length;
        return (
          <span key={i}>
            {getHighlightedText(segment.segment, localHighlights)}
          </span>
        );
      })}
    </p>
  );
};

export const Article = ({ article, ref }: ArticleProps) => {
  const notes: NoteWithHighlights[] = article.notes;
  const highlights: Highlight[] = notes.flatMap(
    (note: NoteWithHighlights): Highlight[] => note.highlights,
  );

  let runningIndex: number = 0;

  return (
    <article className="space-y-6">
      <header className="space-y-5">
        <Title className={"text-3xl"}>{article.title}</Title>
        {article.source && (
          <Source className={"text-lg"}>{article.source}</Source>
        )}
      </header>
      <div ref={ref} className="font-serif text-xl/[300%] space-y-5">
        {article.body.split("\n").map((paragraph: string, index: number) => {
          const localHighlights: Highlight[] = getLocalHighlights(
            runningIndex,
            runningIndex + paragraph.length,
            highlights,
          );
          runningIndex += paragraph.length;
          return (
            <Paragraph
              key={index}
              text={paragraph}
              highlights={localHighlights}
            />
          );
        })}
      </div>
    </article>
  );
};
