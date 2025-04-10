import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().trim(),
  body: z
    .string()
    .trim()
    .transform((val) => val.replace(/\r\n/, "\n").replaceAll(/\n+/, "\n")),
  source: z.string().optional(),
});
