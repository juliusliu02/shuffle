"use client";
import React from "react";
import { honoClient } from "@/lib/rpc/hono-client";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/typography";
import ArticleList from "@/components/article/article-list";
import { ArticleListItem } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading";

const Page = () => {
  const [articles, setArticles] = React.useState<ArticleListItem[]>([]);

  React.useEffect(() => {
    const fetch = async () => {
      const response = await honoClient.articles.$get();
      if (!response.ok) {
        return notFound();
      }

      const data = await response.json();
      setArticles(data);
    };

    fetch();
  }, []);

  if (!articles || !articles.length) {
    return (
      <div>
        <LoadingSpinner className="fixed top-1/2 left-1/2 -translate-1/2" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <PageTitle>My articles</PageTitle>
      <ArticleList articles={articles} />
    </div>
  );
};

export default Page;
