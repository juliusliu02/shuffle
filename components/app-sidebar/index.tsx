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
import React, { useMemo } from "react";
import { appClient } from "@/lib/rpc/app-cli";
import ArticleList from "@/components/app-sidebar/article-list";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import type { ArticleListItem } from "@/lib/types";
import { usePathname } from "next/navigation";

const fetcher = async (): Promise<ArticleListItem[]> => {
  const response = await appClient.articles.$get();
  return response.json();
};

const AppSidebar = () => {
  const { data: articles, error } = useSWR("/api/articles", fetcher);
  const pathname = usePathname();

  const routeId = useMemo<number | undefined>(() => {
    const m = pathname?.match(/\/articles\/(\d+)/);
    if (
      m &&
      articles &&
      articles.some((article) => article.id === Number(m[1]))
    ) {
      return Number(m[1]);
    }
    return undefined;
  }, [pathname, articles]);

  if (error) {
    return error();
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              isActive={routeId === undefined}
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
          <ArticleList articles={articles ?? []} active={routeId} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
