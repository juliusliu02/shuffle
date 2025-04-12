"use client";
import React, { useEffect } from "react";
import { Article } from "@/components/article";
import { Button } from "@/components/ui/button";
import { notFound, useParams } from "next/navigation";
import { InferRequestType } from "hono";
import useSWR from "swr";
import { mutate as globalMutate } from "swr";
import { LoadingSpinner } from "@/components/loading";
import { useTextRange } from "@/hooks/use-text-range";
import Notes from "@/components/note";
import { honoClient } from "@/lib/rpc/hono-client";
import { ArticleWithNotesAndHighlights } from "@/lib/types";
import { toast } from "sonner";

const $get = honoClient.articles[":id"].$get;

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
      return;
    }

    try {
      const response = await honoClient.notes.$post({
        json: { ...note, articleId: Number(id) },
      });

      if (!response.ok) return;
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
    } catch (error) {
      let errorMsg = "Failed to add note.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    }
  };

  return (
    <main className="flex flex-col gap-12 items-center px-4 relative">
      <div
        className="max-w-lg
        md:mr-96 md:ml-[clamp(3rem,20vw-8rem,24rem)]"
        /* 24rem to leave room for the sidebar width plus space around it.
         * left margin grow from 3rem to 24rem while right margin remains as 24rem.
         * -8rem acts as an offset to let left margin start out lower.
         * This ensures smooth and continuous change of left margin over the breakpoints.
         * */
      >
        <Article article={data} ref={containerRef} />
        <Button
          className="fixed bottom-4 right-4 z-10 bg-amber-300 hover:bg-amber-400 text-slate-800"
          onClick={handleClick}
        >
          Add notes
        </Button>
      </div>
      <aside className="relative w-full max-w-lg md:absolute md:w-[max(18rem,15vw)] md:right-12">
        <Notes notes={data.notes} />
      </aside>
    </main>
  );
};

export default Page;
