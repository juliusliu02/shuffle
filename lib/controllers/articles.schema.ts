import { createInsertSchema } from "drizzle-zod";
import { articlesTable } from "@/lib/db/schema";
import { z } from "zod";

export const createArticleSchema = createInsertSchema(articlesTable, {
  title: z.string().trim(),
  body: z
    .string()
    .trim()
    .transform((val) => val.replace(/\r\n/, "\n").replaceAll(/\n+/, "\n")),
  source: z.string().optional(),
});
