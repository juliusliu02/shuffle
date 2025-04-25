import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().trim(),
  body: z
    .string()
    .trim()
    .min(200)
    .transform((val) => val.replace(/\r\n/g, "\n").replaceAll(/\n+/g, "\n")),
  source: z.string().optional(),
});

export const toggleArchiveSchema = z.object({
  isArchived: z.boolean(),
});

export const getArticlesSchema = z.object({
  archive: z.preprocess((val) => val === "true", z.boolean()).default(false),
});
