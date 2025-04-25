"use client";
import React from "react";

import { type InferRequestType } from "hono";
import { notFound, useParams } from "next/navigation";
import useSWR from "swr";

import AnnotationView from "@/components/app-view/annotation-view";
import FlashcardView from "@/components/app-view/flashcard-view";
import { LoadingSpinner } from "@/components/loading";
import ViewContext, { type ViewType } from "@/contexts/ViewContext";
import { appClient } from "@/lib/rpc/app-cli";

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

  const [view, setView] = React.useState<ViewType>("annotation");
  const toggleView = () => {
    setView(view === "annotation" ? "flashcard" : "annotation");
  };

  if (error) {
    return notFound();
  }

  if (!data || isLoading) {
    return (
      <LoadingSpinner className="fixed top-1/2 left-1/2 translate-[-50%]" />
    );
  }

  return (
    <ViewContext.Provider value={{ view, toggleView }}>
      {view === "annotation" ? (
        <AnnotationView article={data} />
      ) : (
        <FlashcardView article={data} />
      )}
    </ViewContext.Provider>
  );
};

export default Page;
