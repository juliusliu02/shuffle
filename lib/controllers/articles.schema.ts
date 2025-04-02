import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().nonempty(),
  source: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
  body: z.string().nonempty(),
});
