import { ArticleInsert, ArticleWithNotesAndHighlights } from "@/lib/types";
import { db } from "../db";
import { articlesTable } from "@/server/db/schema/articles";
import { eq } from "drizzle-orm";

export const createArticle = async (data: ArticleInsert) => {
  return db
    .insert(articlesTable)
    .values(data)
    .returning({ id: articlesTable.id });
};

export const getArticle = async (
  id: number,
): Promise<ArticleWithNotesAndHighlights | undefined> => {
  return db.query.articlesTable.findFirst({
    where: eq(articlesTable.id, id),
    with: {
      notes: {
        with: {
          highlights: true,
        },
      },
    },
  });
};

export const getArticles = async () => {
  return db
    .select({ id: articlesTable.id, title: articlesTable.title })
    .from(articlesTable);
};

export const deleteArticle = async (id: number) => {
  return db.delete(articlesTable).where(eq(articlesTable.id, id));
};
