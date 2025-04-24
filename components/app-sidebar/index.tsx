"use client";
import React from "react";

import { usePathname } from "next/navigation";
import useSWR from "swr";

import ArticleList from "@/components/app-sidebar/article-list";
import QuerySwitcher from "@/components/app-sidebar/query-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { appClient } from "@/lib/rpc/app-cli";
import type { ArticleListItem } from "@/lib/types";

const fetcher = async (): Promise<ArticleListItem[]> => {
  const response = await appClient.articles.$get();
  return response.json();
};

const AppSidebar = () => {
  const { data: articles, error } = useSWR("/api/articles", fetcher);
  const pathname = usePathname();
  // get pathname, match id, get captured group, and cast to number.
  // the result is either an id or NaN.
  const active = Number(pathname?.match(/\/articles\/(\d+)/)?.[1]);

  if (error) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <QuerySwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <ArticleList articles={articles ?? []} active={active} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
