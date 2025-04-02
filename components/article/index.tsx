import React from "react";
import { cn } from "@/lib/utils";
import { type Article as ArticleType } from "@/lib/models";

type WithClass = {
  className?: string;
};

type ParagraphProps = WithClass & {
  text: string;
};

type ArticleProps = {
  article: ArticleType;
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
    <h2 className={cn("text-muted-foreground italic", className)}>
      {children}
    </h2>
  );
};

const Paragraph = ({ text, className }: ParagraphProps) => {
  const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
  const segments = [...segmenter.segment(text)];

  return (
    <p className={className}>
      {segments.map((segment, i) => (
        <span key={i}>{segment.segment}</span>
      ))}
    </p>
  );
};

export const Article = ({ article }: ArticleProps) => {
  return (
    <article className="space-y-6">
      <Title className={"text-3xl"}>{article.title}</Title>
      {article.source && (
        <Source className={"text-lg"}>{article.source}</Source>
      )}
      <div className="font-serif text-xl/[300%] space-y-5">
        {article.body.split("\n").map((line, index) => (
          <Paragraph key={index} text={line} />
        ))}
      </div>
    </article>
  );
};
