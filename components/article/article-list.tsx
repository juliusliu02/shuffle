import React from "react";
import type { ArticleListItem as ArticleListItemType } from "@/lib/models";
import Link from "next/link";

type ArticleListProps = {
  articles: ArticleListItemType[];
};

type ArticleListItemProps = {
  article: ArticleListItemType;
};

const ArticleListItem = ({ article }: ArticleListItemProps) => (
  <li>
    <Link
      href={`/articles/${article.id}`}
      className="block w-full h-full hover:bg-stone-100 transition cursor-pointer rounded-md px-4 py-2"
    >
      {article.title}
    </Link>
  </li>
);

const ArticleList = ({ articles }: ArticleListProps) => {
  return (
    <div className="bg-white border-2 mt-12 rounded-xl p-4">
      <ul>
        {articles.map((article) => (
          <ArticleListItem key={article.id} article={article} />
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;
