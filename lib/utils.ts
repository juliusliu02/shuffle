import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

import type { ArticleListItem } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type dateExpression = {
  group: string;
  date: dayjs.Dayjs;
};

export const datesList: dateExpression[] = [
  { group: "today", date: dayjs().subtract(1, "days") },
  { group: "yesterday", date: dayjs().subtract(2, "days") },
  { group: "last 7 days", date: dayjs().subtract(7, "days") },
  { group: "last 30 days", date: dayjs().subtract(30, "days") },
] as const;

export const groupArticlesByDate = (articles: ArticleListItem[]) => {
  const buckets = new Map<string, ArticleListItem[]>(
    datesList.map((d) => [d.group, []]),
  );
  buckets.set("older", []);

  for (const article of articles) {
    const created = dayjs(article.createdAt);
    const match = datesList.find((d) => created.isAfter(d.date, "day"));
    const key = match?.group ?? "older";
    buckets.get(key)!.push(article);
  }

  return Array.from(buckets, ([group, items]) => ({ group, items }));
};
