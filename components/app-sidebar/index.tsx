"use client";
import React, { useState } from "react";

import type { InferRequestType } from "hono";
import { usePathname } from "next/navigation";
import useSWR from "swr";

import ArticleList from "@/components/app-sidebar/article-list";
import QuerySwitcher from "@/components/app-sidebar/query-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { appClient } from "@/lib/rpc/app-cli";
import type { ArticleListItem } from "@/lib/types";

const $get = appClient.articles.$get;

const fetcher = async (
  arg: InferRequestType<typeof $get>,
): Promise<ArticleListItem[]> => {
  const response = await $get(arg);
  return response.json();
};

const AppSidebar = () => {
  const pathname = usePathname();
  // get pathname, match id, get captured group, and cast to number.
  // the result is either an id or NaN.
  const active = Number(pathname?.match(/\/articles\/(\d+)/)?.[1]);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const { data: articles, error } = useSWR(["/api/articles", isArchived], () =>
    fetcher({
      query: {
        archive: isArchived.toString(),
      },
    }),
  );

  if (error) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <QuerySwitcher isArchive={isArchived} setIsArchive={setIsArchived} />
      </SidebarHeader>
      <SidebarContent>
        <ArticleList
          articles={articles ?? []}
          active={active}
          isArchived={isArchived}
        />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
