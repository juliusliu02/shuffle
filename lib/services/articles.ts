import { ArticleInsert } from "@/lib/models";
import { db } from "@/lib/db";
import { articlesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const createArticle = async (data: ArticleInsert) => {
  return db
    .insert(articlesTable)
    .values(data)
    .returning({ id: articlesTable.id });
};

export const getArticle = async (id: number) => {
  return db.select().from(articlesTable).where(eq(articlesTable.id, id));
};

export const getArticles = async () => {
  return db
    .select({ id: articlesTable.id, title: articlesTable.title })
    .from(articlesTable);
};
