import { z } from "zod";

export const createHighlightSchema = z.object({
  noteId: z.number().positive(),
  startOffset: z.number().positive(),
  endOffset: z.number().positive(),
});

export const hightlightWithoutNoteIdSchema = createHighlightSchema.omit({
  noteId: true,
});
