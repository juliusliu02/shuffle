import { z } from "zod";

export const createHighlightSchema = z.object({
  noteId: z.number().positive(),
  startOffset: z.number().nonnegative(),
  endOffset: z.number().nonnegative(),
});

export const hightlightWithoutNoteIdSchema = createHighlightSchema.omit({
  noteId: true,
});
