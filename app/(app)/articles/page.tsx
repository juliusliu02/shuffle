"use client";
import React from "react";
import { appClient } from "@/lib/rpc/app-cli";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/typography";
import ArticleList from "@/components/article/article-list";
import { ArticleListItem } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading";

const Page = () => {
  const [articles, setArticles] = React.useState<ArticleListItem[] | undefined>(
    [],
  );

  React.useEffect(() => {
    const fetch = async () => {
      const response = await appClient.articles.$get();

      // @ts-expect-error -- Middleware response is not showing up in type inference.
      if (response.status === 403) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) {
        return notFound();
      }

      const data = await response.json();
      setArticles(data);
    };

    fetch();
  }, []);

  if (articles === undefined) {
    return (
      <div>
        <LoadingSpinner className="fixed top-1/2 left-1/2 -translate-1/2" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-32">
      <PageTitle>My articles</PageTitle>
      {articles.length > 0 ? (
        <ArticleList articles={articles} />
      ) : (
        <p className="mt-8">You currently don&#39;t have any articles.</p>
      )}
    </div>
  );
};

export default Page;
