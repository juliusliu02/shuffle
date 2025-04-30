import React from "react";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NoteSelect } from "@/lib/types";

type FlashcardProps = {
  source: string | null;
  title: string;
  note: NoteSelect;
};

const Flashcard = ({ source, title, note }: FlashcardProps) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLParagraphElement>(null);

  return (
    <Card className="gap-4 group" onClick={() => setOpen(!open)}>
      <CardHeader>
        <Breadcrumb>
          <BreadcrumbList>
            {source && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-muted-foreground">
                    {source}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbLink asChild>
              <Link href={`/articles/${note.articleId}`}>{title}</Link>
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl">{note.entry}</CardTitle>
        <CardDescription className="mt-2 ml-1 border-l-2 pl-4 text-base">
          {note.context}
        </CardDescription>
        {note.note && (
          // reference: https://gist.github.com/nimone/38c699e876ff9ec64e1b800630681d08
          <div
            className="overflow-y-hidden transition-all"
            style={{ height: open ? ref.current?.offsetHeight || 0 : 0 }}
          >
            <p className="pt-3" ref={ref}>
              {note.note}
            </p>
          </div>
        )}
      </CardContent>
      {note.type && (
        <CardFooter>
          <div className="bg-amber-200 px-2 py-1 rounded-md">{note.type}</div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Flashcard;
