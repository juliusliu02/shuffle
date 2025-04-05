import { createInsertSchema } from "drizzle-zod";
import { notesTable } from "@/lib/db/schema";
import { hightlightWithoutNoteIdSchema } from "@/lib/controllers/highlights.schema";

export const createNoteSchema = createInsertSchema(notesTable).omit({
  id: true,
});

export const createNoteWithHighlightSchema = createNoteSchema.extend({
  highlights: hightlightWithoutNoteIdSchema.array(),
});
