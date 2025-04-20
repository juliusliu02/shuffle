import React from "react";

import Link from "next/link";

import ItemAction from "@/components/app-sidebar/item-action";
import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { ArticleListItem } from "@/lib/types";
import { groupArticlesByDate } from "@/lib/utils";

type ArticleListProps = {
  articles: ArticleListItem[];
  active: number | undefined;
};

const ArticleList = ({ articles, active }: ArticleListProps) => {
  const groupedArticles = groupArticlesByDate(articles);
  return (
    <>
      {groupedArticles.map((articleGroup) => {
        if (articleGroup.items.length > 0) {
          return (
            <React.Fragment key={articleGroup.group}>
              <SidebarGroupLabel className="capitalize">
                {articleGroup.group}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {articleGroup.items.map((article) => (
                    <SidebarMenuItem key={article.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={active === article.id}
                      >
                        <Link
                          className="cursor-pointer group/item"
                          href={`/articles/${article.id}`}
                        >
                          <span className="truncate text-clip">
                            {article.title}
                          </span>
                          <ItemAction id={article.id} />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </React.Fragment>
          );
        }
      })}
    </>
  );
};

export default ArticleList;
