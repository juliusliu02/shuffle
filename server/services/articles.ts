import {
  type ArticleInsert,
  type ArticleListItem,
  type ArticleWithNotesAndHighlights,
} from "@/lib/types";
import { db } from "../db";
import { articlesTable } from "@/server/db/schema/articles";
import { and, eq } from "drizzle-orm";

export const createArticle = async (
  data: ArticleInsert,
): Promise<ArticleListItem[]> => {
  return db.insert(articlesTable).values(data).returning({
    id: articlesTable.id,
    title: articlesTable.title,
    createdAt: articlesTable.createdAt,
  });
};

export const setArchive = async (
  id: number,
  isArchived: boolean,
  userId: number,
) => {
  return db
    .update(articlesTable)
    .set({
      isArchived,
    })
    .where(and(eq(articlesTable.id, id), eq(articlesTable.userId, userId)));
};

export const getArticle = async (
  id: number,
  userId: number,
): Promise<ArticleWithNotesAndHighlights | undefined> => {
  return db.query.articlesTable.findFirst({
    where: and(eq(articlesTable.id, id), eq(articlesTable.userId, userId)),
    with: {
      notes: {
        with: {
          highlights: true,
        },
      },
    },
  });
};

// returns not archived articles for now
// TODO: support archived
export const getArticles = async (
  userId: number,
  isArchived: boolean = false,
) => {
  return db
    .select({
      id: articlesTable.id,
      title: articlesTable.title,
      createdAt: articlesTable.createdAt,
    })
    .from(articlesTable)
    .where(
      and(
        eq(articlesTable.userId, userId),
        eq(articlesTable.isArchived, isArchived),
      ),
    );
};

export const deleteArticle = async (id: number, userId: number) => {
  return db
    .delete(articlesTable)
    .where(and(eq(articlesTable.id, id), eq(articlesTable.userId, userId)));
};
