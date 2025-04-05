import { ArticleInsert, ArticleWithNotesAndHighlights } from "@/lib/models";
import { db } from "@/lib/db";
import { articlesTable } from "@/lib/db/schema";
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
