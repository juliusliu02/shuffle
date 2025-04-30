import React, { useEffect } from "react";

import { toast } from "sonner";
import { mutate as globalMutate } from "swr/_internal";

import { Article } from "@/components/article";
import Notes from "@/components/note";
import { accentButtonVariants } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useTextRange } from "@/hooks/use-text-range";
import { appClient } from "@/lib/rpc/app-cli";
import type { ArticleWithNotesAndHighlights } from "@/lib/types";
import { cn } from "@/lib/utils";

type AnnotationViewProps = {
  article: ArticleWithNotesAndHighlights;
};

const getContextNode = (node: Node, tag: keyof HTMLElementTagNameMap) => {
  let contextNode: Node | ParentNode | null = node;
  while (contextNode && contextNode.nodeName.toLowerCase() !== tag) {
    contextNode = contextNode.parentNode;
  }
  return contextNode ?? node; // fallback to original node content
};

const AnnotationView = ({ article }: AnnotationViewProps) => {
  const {
    containerRef,
    selectedTexts,
    selectedNodes,
    selectedRanges,
    getOffsets,
  } = useTextRange();

  // attach event listener
  useEffect(() => {
    window.addEventListener("mouseup", getOffsets);
    return () => window.removeEventListener("mouseup", getOffsets);
  }, [getOffsets]);

  const handleClick = async () => {
    const contextNodes = selectedNodes.map((node) =>
      getContextNode(node, "span"),
    ); // context is a sentence wrapped in a span

    const note = {
      entry: selectedTexts.join(" ... "),
      highlights: selectedRanges,
      context: [...new Set(contextNodes)] // eliminate duplicate
        .map((node) => node.textContent) // get text
        .join(" ") // segmenter preserves white space but there is no whitespace across paragraphs
        .replaceAll(/ +/g, " ") // remove extra whitespaces
        .trim(),
    };

    if (selectedRanges.length === 0) {
      toast.warning("You haven't selected words to highlight.");
      return;
    }

    try {
      const response = await appClient.notes.$post({
        json: { ...note, articleId: article.id },
      });

      if (!response.ok) {
        toast.error("An error occurred. Please try again later.");
        return;
      }
      const data = await response.json();
      await globalMutate(
        `/api/articles/${article.id}`,
        (old: ArticleWithNotesAndHighlights | undefined) => {
          if (!old) return old; // the first load hasn’t finished yet
          return {
            ...old,
            notes: [...old.notes, data.note],
          };
        },
        false, // don’t revalidate; we already have the right data
      );
      toast.success("Note created successfully.");
    } catch (e) {
      console.log(e);
      let errorMsg = "Failed to add note.";
      if (e instanceof Error) {
        errorMsg = e.message;
      }
      toast.error(errorMsg);
    }
  };

  return (
    <div className="relative lg:flex overscroll-y-contain h-[calc(100vh-4rem)] overflow-y-auto">
      <div
        className="mt-12 break-words
        lg:max-w-2xl lg:w-2/3 px-8 lg:mx-auto lg:pr-12 mb-12"
      >
        <Article article={article} ref={containerRef} />
      </div>
      <Button
        className={cn(accentButtonVariants(), "fixed bottom-4 right-4 z-10")}
        onClick={handleClick}
      >
        Add notes
      </Button>
      <aside
        className="w-full lg:sticky lg:self-start
        lg:shrink-0 lg:top-14 lg:w-80 lg:right-8 lg:bottom-4
        lg:max-h-[calc(100vh-12rem)] lg:overflow-y-scroll lg:scrollbar-hidden px-8"
      >
        <Notes notes={article.notes} />
      </aside>
    </div>
  );
};

export default AnnotationView;
