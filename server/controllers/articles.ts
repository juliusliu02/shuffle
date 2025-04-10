import { Hono } from "hono";
import { createArticleSchema } from "@/lib/schemas/articles";
import { zValidator } from "@hono/zod-validator";
import * as articleSerivce from "@/server/services/articles";

const ArticleApp = new Hono()
  .get("/", async (c) => {
    const articles = await articleSerivce.getArticles();
    return c.json(articles, 200);
  })
  .post("/", zValidator("json", createArticleSchema), async (c) => {
    const validatedFields = c.req.valid("json");
    const { id } = (await articleSerivce.createArticle(validatedFields))[0];
    return c.json({ id }, 201);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return c.json({ error: "Invalid article id" }, 400);
    }

    const article = await articleSerivce.getArticle(articleId);
    if (!article) {
      return c.json({ error: "Article not found" }, 404);
    }
    return c.json(article, 200);
  });

export default ArticleApp;
