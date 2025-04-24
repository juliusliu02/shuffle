import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import {
  createArticleSchema,
  toggleArchiveSchema,
} from "@/lib/schemas/articles";
import type { ArticleInsert } from "@/lib/types";
import { requireAuth } from "@/server/middlewares/auth";
import * as articleService from "@/server/services/articles";
import { generateAnkiCSV } from "@/server/utils/export";

const ArticleApp = new Hono()
  .use(requireAuth())
  .get("/", async (c) => {
    const articles = await articleService.getArticles(c.get("user").id);
    return c.json(articles, 200);
  })
  .post("/", zValidator("json", createArticleSchema), async (c) => {
    const validatedFields = c.req.valid("json");
    const articleData: ArticleInsert = {
      ...validatedFields,
      userId: c.get("user").id,
    };
    const data = (await articleService.createArticle(articleData))[0];
    return c.json({ ...data }, 201);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const articleId = Number(id);
    if (isNaN(articleId)) {
      return c.json({ error: "Invalid article id" }, 400);
    }

    const article = await articleService.getArticle(
      articleId,
      c.get("user").id,
    );
    if (!article) {
      return c.json({ error: "Article not found" }, 404);
    }
    return c.json(article, 200);
  })
  .patch("/:id", zValidator("json", toggleArchiveSchema), async (c) => {
    const { id } = c.req.param();
    const { isArchived } = c.req.valid("json");
    const articleId = Number(id);
    if (isNaN(articleId)) {
      return c.json({ error: "Invalid article id" }, 400);
    }
    const result = await articleService.setArchive(
      articleId,
      isArchived,
      c.get("user").id,
    );
    if (result.rowsAffected === 0) {
      return c.json({ error: "Article not found" }, 404);
    }
    return c.body(null, 204);
  })
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const articleId = Number(id);
    if (isNaN(articleId)) {
      return c.json({ error: "Invalid article id" }, 400);
    }

    await articleService.deleteArticle(articleId, c.get("user").id);
    return c.body(null, 204);
  })
  .get("/:id/flashcards", async (c) => {
    const { id } = c.req.param();
    const articleId = Number(id);
    if (isNaN(articleId)) {
      return c.json({ error: "Invalid article id" }, 400);
    }

    const article = await articleService.getArticle(
      articleId,
      c.get("user").id,
    );
    if (!article) {
      return c.json({ error: "Article not found" }, 404);
    }

    const response = generateAnkiCSV(article);
    c.header("Content-Type", "text/csv");
    c.header(
      "Content-Disposition",
      `attachment; filename=${article.title}_notes.csv`,
    );
    c.status(200);
    return c.body(response);
  });

export default ArticleApp;
