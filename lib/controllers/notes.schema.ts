import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { notesTable } from "@/lib/db/schema";
import { hightlightWithoutNoteIdSchema } from "@/lib/controllers/highlights.schema";
import { z } from "zod";

export const createNoteSchema = createInsertSchema(notesTable, {
  entry: (schema) => schema.nonempty(),
  type: (schema) =>
    schema
      .transform((val) => (val.trim().length === 0 ? null : val))
      .optional(),
  note: (schema) =>
    schema
      .transform((val) => (val.trim().length === 0 ? null : val))
      .optional(),
}).omit({
  id: true,
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

export const deleteNoteSchema = createSelectSchema(notesTable, {
  id: z.coerce.number(),
}).pick({
  id: true,
});
