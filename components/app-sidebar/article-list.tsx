import React from "react";

import { PencilLine } from "lucide-react";
import Link from "next/link";

import ItemAction from "@/components/app-sidebar/item-action";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { ArticleListItem } from "@/lib/types";
import { groupArticlesByDate } from "@/lib/utils/date";

type ArticleListProps = {
  articles: ArticleListItem[];
  active: number;
  isArchived: boolean;
};

const ArticleList = ({ articles, active, isArchived }: ArticleListProps) => {
  const groupedArticles = groupArticlesByDate(articles);
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isNaN(active)} asChild>
                <Link href="/">
                  <PencilLine className="text-muted-foreground" />
                  <span>Add an article</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {groupedArticles.map((articleGroup) => {
        if (articleGroup.items.length > 0) {
          return (
            <SidebarGroup key={articleGroup.group}>
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
                          <ItemAction id={article.id} isArchived={isArchived} />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        }
      })}
    </>
  );
};

export default ArticleList;
