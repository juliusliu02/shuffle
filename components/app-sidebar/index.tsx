"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import type { ArticleListItem } from "@/lib/types";
import { appClient } from "@/lib/rpc/app-cli";
import { notFound } from "next/navigation";
import { LoadingSpinner } from "@/components/loading";
import ArticleList from "@/components/app-sidebar/article-list";
import { FilePlus2 } from "lucide-react";
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              isActive={active === undefined}
              onClick={() => setActive(undefined)}
              asChild
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FilePlus2 className="size-4" />
                </div>
                <div className="font-medium">New article</div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <ArticleList
            articles={articles}
            active={active}
            setActive={setActive}
          />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
