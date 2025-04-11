import React from "react";
import { honoClient } from "@/lib/rpc/hono-client";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/typography";
import ArticleList from "@/components/article/article-list";

const Page = async () => {
  const response = await honoClient.api.articles.$get();
  if (!response.ok) {
    return notFound();
  }

  const data = await response.json();

  return (
    <div className="max-w-xl mx-auto">
      <PageTitle>My articles</PageTitle>
      <ArticleList articles={data} />
    </div>
  );
};

export default Page;
