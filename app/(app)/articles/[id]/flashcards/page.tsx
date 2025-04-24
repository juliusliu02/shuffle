"use client";
import React, { useEffect } from "react";

import type { InferRequestType } from "hono";
import { useParams } from "next/navigation";
import useSWR from "swr";

import Flashcard from "@/components/flashcard";
import {
  Carousel,
  CarouselBar,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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

  const { data, error } = useSWR(
    `/api/articles/${id}`,
    fetcher({ param: { id } }),
  );

  useEffect(() => {
    if (data) {
      document.title = `Flashcards — ${data.title} | Shuffle`;
    }
  }, [data]);

  if (!data || error) return null;

  return (
    <div className="flex justify-center relative top-1/4">
      <Carousel className="w-full max-w-2xl">
        <CarouselContent>
          {data.notes.map((note) => (
            <CarouselItem key={note.id} className="py-4">
              <Flashcard note={note} title={data.title} source={data.source} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselBar />
      </Carousel>
    </div>
  );
};

export default Page;
