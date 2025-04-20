import { z } from "zod";

import { hightlightWithoutNoteIdSchema } from "@/lib/schemas/highlights";

export const createNoteSchema = z.object({
  entry: z.string().nonempty(),
  type: z
    .string()
    .transform((val) => (val.trim().length === 0 ? null : val))
    .optional(),
  note: z
    .string()
    .transform((val) => (val.trim().length === 0 ? null : val))
    .optional(),
  context: z.string().nonempty(),
  articleId: z.number().positive(),
});

export const createNoteWithHighlightSchema = createNoteSchema.extend({
  highlights: hightlightWithoutNoteIdSchema.array(),
});

export const updateNoteSchema = createNoteSchema
  .pick({
    entry: true,
    type: true,
    note: true,
  })
  .partial();

export const deleteNoteSchema = z.object({
  id: z.coerce.number(),
});
