import React from "react";
import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Ellipsis } from "lucide-react";
import type { ArticleListItem } from "@/lib/types";
import { groupArticlesByDate } from "@/lib/utils";

type ArticleListProps = {
  articles: ArticleListItem[];
  active: number | undefined;
  setActive: (active: number | undefined) => void;
};

const ArticleList = ({ articles, active, setActive }: ArticleListProps) => {
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
                        onClick={() => {
                          setActive(article.id);
                        }}
                        isActive={active === article.id}
                      >
                        <div className="cursor-pointer group/item">
                          <Link
                            href={`/articles/${article.id}`}
                            className="truncate text-clip"
                          >
                            {article.title}
                          </Link>
                          <Ellipsis className="ml-auto opacity-0 group-hover/item:opacity-100" />
                        </div>
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
