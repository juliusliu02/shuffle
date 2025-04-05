"use client";
import React, { useEffect } from "react";
import { Article } from "@/components/article";
import { Button } from "@/components/ui/button";
import { notFound, useParams } from "next/navigation";
import { honoClient } from "@/lib/rpc/hono-client";
import { InferRequestType } from "hono";
import useSWR from "swr";
import { LoadingSpinner } from "@/components/loading";
import { useTextRange } from "@/hooks/use-text-range";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const $get = honoClient.api.articles[":id"].$get;

  const fetcher = (arg: InferRequestType<typeof $get>) => async () => {
    const res = await $get(arg);
    if (!res.ok) {
      const { error: errorMessage } = await res.json();
      throw new Error(errorMessage);
    }
    return await res.json();
  };

  const { data, error, isLoading } = useSWR(
    `/api/articles/${id}`,
    fetcher({ param: { id } }),
  );

  const { containerRef, selectedTexts, selectedRanges, getOffsets } =
    useTextRange();

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
    };

    if (selectedRanges.length === 0) {
      return;
    }

    try {
      const response = await honoClient.api.notes.$post({
        json: { ...note, articleId: Number(id) },
      });
      console.log(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mt-12 mx-auto">
      <Article article={data} ref={containerRef} />
      <Button className="fixed bottom-4 right-4" onClick={handleClick}>
        Add notes
      </Button>
    </div>
  );
};

export default Page;
