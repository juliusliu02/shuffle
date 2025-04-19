"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import type { ArticleListItem } from "@/lib/types";
import { appClient } from "@/lib/rpc/app-cli";
import { notFound } from "next/navigation";
import { LoadingSpinner } from "@/components/loading";
import Link from "next/link";

const getArticleIdOnPage = () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  const currentPath = window.location.pathname;
  if (!currentPath || !currentPath.startsWith("/articles/")) {
    return undefined;
  }
  const articleId = Number(currentPath.replace("/articles/", ""));
  if (isNaN(articleId)) {
    return undefined;
  }
  return articleId;
};

const AppSidebar = () => {
  const [articles, setArticles] = useState<ArticleListItem[] | undefined>(
    undefined,
  );
  const [active, setActive] = useState<number | undefined>(
    getArticleIdOnPage(),
  );

  useEffect(() => {
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
      setArticles(data.sort((a, b) => b.id - a.id));
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Articles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {articles.map((article) => (
                <SidebarMenuItem key={article.id}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => {
                      setActive(article.id);
                    }}
                    isActive={active === article.id}
                  >
                    <Link
                      href={`/articles/${article.id}`}
                      className="truncate inline-block"
                    >
                      {article.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
