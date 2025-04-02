"use client";
import React from "react";
import { Article } from "@/components/article";
import { Button } from "@/components/ui/button";
import { notFound, useParams } from "next/navigation";
import { honoClient } from "@/lib/rpc/hono-client";
import { InferRequestType } from "hono";
import useSWR from "swr";
import { LoadingSpinner } from "@/components/loading";
import { getSelection } from "@/lib/utils";

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

  if (isLoading) {
    return (
      <LoadingSpinner className="fixed top-1/2 left-1/2 translate-[-50%]" />
    );
  }

  if (error || !data) {
    return notFound();
  }

  const handleClick = () => {
    console.log(getSelection());
  };

  return (
    <div className="max-w-xl mt-12 mx-auto">
      <Article article={data} />
      <Button className="fixed bottom-4 right-4" onClick={handleClick}>
        Add notes
      </Button>
    </div>
  );
};

export default Page;
