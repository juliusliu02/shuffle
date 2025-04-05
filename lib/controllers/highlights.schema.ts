import { createInsertSchema } from "drizzle-zod";
import { highlightsTable } from "@/lib/db/schema";

export const createHighlightSchema = createInsertSchema(highlightsTable).omit({
  id: true,
});

export const hightlightWithoutNoteIdSchema = createHighlightSchema.omit({
  noteId: true,
});
