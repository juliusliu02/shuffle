"use client";
import React, { useEffect } from "react";

import { type InferRequestType } from "hono";
import { notFound, useParams } from "next/navigation";
import { toast } from "sonner";
import useSWR, { mutate as globalMutate } from "swr";

import { Article } from "@/components/article";
import { LoadingSpinner } from "@/components/loading";
import Notes from "@/components/note";
import { Button } from "@/components/ui/button";
import { useTextRange } from "@/hooks/use-text-range";
import { appClient } from "@/lib/rpc/app-cli";
import { type ArticleWithNotesAndHighlights } from "@/lib/types";

const $get = appClient.articles[":id"].$get;

const fetcher = (arg: InferRequestType<typeof $get>) => async () => {
  const res = await $get(arg);
  if (!res.ok) {
    const { error: errorMessage } = await res.json();
    throw new Error(errorMessage);
  }
  return await res.json();
};

const Page = () => {
  const { id } = useParams<{ id: string }>();

  const { data, error, isLoading } = useSWR(
    `/api/articles/${id}`,
    fetcher({ param: { id } }),
  );

  useEffect(() => {
    if (data) {
      document.title = `${data.title} | Shuffle`;
    }
  }, [data]);

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

  if (isLoading) {
    return (
      <LoadingSpinner className="fixed top-1/2 left-1/2 translate-[-50%]" />
    );
  }

  if (error || !data) {
    return notFound();
  }

  const handleClick = async () => {
    const note = {
      entry: selectedTexts.join(" ... "),
      highlights: selectedRanges,
      context: selectedNodes
        .map((node) => node.textContent)
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
        json: { ...note, articleId: Number(id) },
      });

      if (!response.ok) {
        toast.error("An error occurred. Please try again later.");
        return;
      }
      const data = await response.json();
      await globalMutate(
        `/api/articles/${id}`,
        (old: ArticleWithNotesAndHighlights | undefined) => {
          if (!old) return old; // first load hasn’t finished yet
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
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    }
  };

  return (
    <div className="lg:flex">
      <div
        className="mt-12 break-words
                      lg:max-w-2xl lg:w-2/3 px-8 lg:mx-auto lg:pr-12 mb-12"
      >
        <Article article={data} ref={containerRef} />
      </div>
      <Button
        className="fixed bottom-4 right-4 z-10 bg-amber-300 hover:bg-amber-400 text-slate-800"
        onClick={handleClick}
      >
        Add notes
      </Button>
      <aside
        className="px-8 relative w-full
        lg:shrink-0 lg:pt-[3.75rem] lg:scrollbar-hidden lg:overflow-y-scroll lg:w-80 lg:right-8"
      >
        <Notes notes={data.notes} />
      </aside>
    </div>
  );
};

export default Page;
